const fs = require('fs')
const { getAppDataPath } = require('appdata-path')
const request = require('request-promise-native')
const crypto = require('crypto')
const sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex')

const API = 'https://live.ksmobile.net'
const IAG = 'https://iag.ksmobile.net'
const URL = {
    exists: `${IAG}/1/cgi/is_exist`,
    login: `${IAG}/1/cgi/login`,
    appLogin: `${API}/sns/appLoginCM`,

    accessToken: `${API}/channel/signin`,
    channelLogin: `${API}/channel/login`,

    userInfo: `${API}/user/getinfo`,
    videoInfo: `${API}/live/queryinfo`,
    replayVideos: `${API}/live/getreplayvideos`,
    keywordSearch: `${API}/search/searchkeyword`,
    liveUsers: `${API}/live/newmaininfo`,
    fans: `${API}/follow/getfollowerlistship`,
    following: `${API}/follow/getfollowinglistship`,
    trendingHashtags: `${API}/search/getTags`,
    liveBoys: `${API}/live/boys`,
    liveGirls: `${API}/live/girls`,
}

class LiveMe {

    constructor(params = {}) {

        // Login details
        this.email = params.email || null
        this.password = params.password || null
        // Userdata
        this.user = null
        // Tokens
        this.tuid = null
        this.token = null
        this.accessToken = null
        this.sid = null
        this.ssoToken = null
        this.androidid = createUUID()
        this.thirdchannel = 6

        if (this.email && this.password) {
            const authData = this.getAuthFile()
            if (!authData) {
                this.getAccessTokens()
                    .then(() => {
                        console.log('Authenticated with Live.me servers.')
                    })
                    .catch(err => {
                        try {
                            const json = JSON.parse(err.response.body)
                            console.log(json)
                        } catch (e) {
                            console.log(err.message)
                        }
                    })
            } else {
                Object.assign(this, authData)
                console.log('Authenticated using cached user details.')
            }
        }

        // Keep updating access tokens.
        setInterval(() => {
            this.getAccessTokens()
                .catch(err => {
                    try {
                        const json = JSON.parse(err.response.body)
                        console.log(json)
                    } catch (e) {
                        console.log(err.message)
                    }
                })
        }, 1.5 * 60 * 60 * 1000)
    }

    saveAuthToFile() {
        const path = `${getAppDataPath()}/liveme-api`
        const name = `${sha256(this.email)}.json`
        const data = Object.assign(this, {
            updated: Date.now()
        })
        if (!fs.existsSync(path)) fs.mkdirSync(path)
        fs.writeFileSync(`${path}/${name}`, JSON.stringify(data))
    }

    getAuthFile() {
        const path = `${getAppDataPath()}/liveme-api/${sha256(this.email)}.json`
        try {
            const data = JSON.parse(fs.readFileSync(path))
            // No data or invalid
            if (!data) return false
            // If auth data is not outdated, return it
            if (Date.now() - data.updated < 60 * 60 * 1000) return data
            // Data outdated
            return false
        } catch (e) { return false }
    }

    setAuthDetails(email, password) {
        if ( ! email || ! password) {
            return Promise.reject('You need to provide your Live.me email and password.')
        }
        this.email = email
        this.password = password

        const authData = this.getAuthFile()
        if (!authData) {
            return this.getAccessTokens()
        }
        Object.assign(this, authData)
        return Promise.resolve(authData)
    }

    fetch(method, params = {}, qs = {}) {
        const url = URL[method] || method
        return request(Object.assign({
            method: 'POST',
            url,
            headers: {
                'Accept': '*/*',
                'User-Agent': 'Dalvik/1.6.0 (Linux; U; Android 4.4.2; SAMSUNG Build/KOT49H)',
                'Cache-Control': 'no-cache',
                d: Math.round(new Date().getTime() / 1000)
            },
            qs: Object.assign({
                vercode: '39151164',
                api: '24',
                ver: '3.9.15'
            }, qs),
            transform: function (body) {
                if (typeof body === 'string') body = JSON.parse(body)
                if (body.status === undefined) body.status = 200
                if (body.ret === undefined) body.ret = 1
                if (body.status != 200 || body.ret != 1) {
                    throw new Error(body)
                }
                return body.data
            }
        }, params))
    }

    getAccessTokens() {
        if ( ! this.email || ! this.password) {
            return Promise.reject('You need to provide your Live.me email and password.')
        }

        return request({
            method: 'POST',
            url: URL.exists,
            headers: {
                d: Math.round(new Date().getTime() / 1000),
                sig: 'NACqiiY5X5J-qNCE8Iy80BJbx8U',
                sid: '6F77A61D34F218A8BC3ACF4A22B4D048',
                appid: 135301,
                ver: '3.9.15',
                'content-type': 'multipart/form-data; boundary=3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f',
                'user-agent': 'FBAndroidSDK.0.0.1',
                host: 'iag.ksmobile.net'
            },
            body: `--3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f\r\nContent-Disposition: form-data; name="cmversion"\r\n\r\n39151164\r\n--3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f\r\nContent-Disposition: form-data; name="name"\r\n\r\n${this.email}\r\n--3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f`,
            transform: function (body) {
                if (typeof body === 'string') body = JSON.parse(body)
                return body
            }
        })
        .then(json => {
            console.log('IS_EXIST RESPONSE: ', json)
            return request({
                method: 'POST',
                url: URL.login,
                headers: {
                    d: Math.round(new Date().getTime() / 1000),
                    sig: 'NACqiiY5X5J-qNCE8Iy80BJbx8U',
                    sid: '6F77A61D34F218A8BC3ACF4A22B4D048',
                    appid: 135301,
                    ver: '3.9.15',
                    'content-type': 'multipart/form-data; boundary=3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f',
                    'user-agent': 'FBAndroidSDK.0.0.1',
                    host: 'iag.ksmobile.net'
                },
                body: `--3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f\r\nContent-Disposition: form-data; name="cmversion"\r\n\r\n39151164\r\n--3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f\r\nContent-Disposition: form-data; name="code"\r\n\r\n\r\n--3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f\r\nContent-Disposition: form-data; name="name"\r\n\r\n${this.email}\r\n--3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f\r\nContent-Disposition: form-data; name="extra"\r\n\r\nuserinfo\r\n--3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f\r\nContent-Disposition: form-data; name="password"\r\n\r\n${this.password}\r\n--3i2ndDfv2rTHiSisAbouNdArYfORhtTPEefj3q2f`,
                transform: function (body) {
                    if (typeof body === 'string') body = JSON.parse(body)
                    if (body.status === undefined) body.status = 200
                    if (body.ret === undefined) body.ret = 1
                    if (body.status != 200 || body.ret != 1) {
                        throw new Error(body)
                    }
                    return body.data
                }
            })
        })
        .then(json => {
            this.sid = json.sid
            // Set SSO token
            this.ssoToken = json.sso_token
            // Pass token to login
            return json.sso_token
        })
        .then(ssoToken => {
            // Login
            return this.fetch('appLogin', {
                form: {
                    'data[email]': this.email,
                    'data[sso_token]': ssoToken,
                    sso_token: ssoToken,
                    // placeholder values
                    'data[uid]': '',
                    'data[face]': '',
                    'data[big_face]': '',
                    'data[from]': 0,
                    'data[sex]': -1,
                    'data[is_verified]': 0,
                    'data[birthday]': '',
                    'data[mobile]': '',
                    'data[smid]': '',
                    token: '',
                    version: 1,
                    netst: 1,
                    status: 0
                }
            }, {
                os: 'android',
                model: 'SAMSUNG'
            })
        })
        .then(json => {
            this.user = json.user
            this.tuid = json.user.user_info.uid
            this.token = json.token
            
            this.saveAuthToFile()

            return json
        })
        .catch(err => {
            const res = err.response
            if (res && res.body) {
                const json = JSON.parse(res.body)
                if (json.data.captcha) {
                    console.log('RECEIVED_CAPTCHA, Retrying...')
                    return this.sendCaptchaRequest(json.data.captcha)
                        .then(() => {
                            return setTimeout(() => this.getAccessTokens(), 5000)
                        })
                        .catch(() => {
                            return Promise.reject(err)
                        })
                }
            }
            return Promise.reject(err)
        })
    }

    sendCaptchaRequest(url) {
        return request({
            method: 'GET',
            url,
            simple: true
        })
    }

    getUserInfo(userid) {
        if ( ! userid) {
            return Promise.reject('Invalid userid.')
        }

        return this.fetch('userInfo', {
            formData: {
                userid
            }
        })
        .then(json => {
            return json.user
        })
    }

    getVideoInfo(videoid) {
        if ( ! videoid) {
            return Promise.reject('Invalid videoid.')
        }

        if ( ! this.user) {
            return Promise.reject('Not authenticated with Live.me!')
        }

        return this.fetch('videoInfo', {
            formData: {
                videoid,
                userid: 0,
                tuid: this.tuid,
                token: this.token
            }
        })
        .then(json => {
            return json.video_info
        })
    }

    getUserReplays(userid, page_index = 1, page_size = 10) {
        if ( ! userid) {
            return Promise.reject('Invalid userid.')
        }

        if ( ! this.user) {
            return Promise.reject('Not authenticated with Live.me!')
        }

        return this.fetch('replayVideos', {
            formData: {
                userid,
                page_index,
                page_size,
                tuid: this.tuid,
                token: this.token,
                sso_token: this.ssoToken
            }
        })
        .then(json => {
            return json.video_info
        })
    }

    getChatHistoryForVideo(url) {
        return request(url)
    }

    getCommentHistoryForReplay(url) {
        return request(url)
    }

    performSearch(query = '', page = 1, pagesize = 10, type, countryCode = '') {
        if ([1, 2].indexOf(type) === -1) {
            return Promise.reject('Type must be 1 or 2.')
        }
        return this.fetch('keywordSearch', {
            formData: {
               keyword: encodeURIComponent(query),
               type,
               pagesize,
               page,
               countryCode
            }
        })
        .then(json => {
            return json.data_info
        })
    }

    getLive(page_index = 1, page_size = 10, countryCode = '') {
        return this.fetch('liveUsers', {
            formData: {
                page_index,
                page_size,
                countryCode
            }
        })
            .then(json => {
                return json.video_info
            })
    }

    getFans(access_token, page_index = 1, page_size = 10) {
        if ( ! access_token) {
            return Promise.reject('Invalid access_token (userid).')
        }

        return this.fetch('fans', {
            formData: {
                access_token,
                page_index,
                page_size
            }
        })
    }

    getFollowing(access_token, page_index = 1, page_size = 10) {
        if ( ! access_token) {
            return Promise.reject('Invalid access_token (userid).')
        }

        return this.fetch('following', {
            formData: {
                access_token,
                page_index,
                page_size
            }
        })
    }

    getTrendingHashtags() {
        return this.fetch('trendingHashtags')
    }

    getLiveGirls(page_size = 10, page = 1, countryCode = '') {
        return this.fetch('liveGirls', {
            formData: {
                page,
                page_size,
                countryCode
            }
        })
    }

    getLiveBoys(page_size = 10, page = 1, countryCode = '') {
        return this.fetch('liveBoys', {
            formData: {
                page,
                page_size,
                countryCode
            }
        })
    }
}

module.exports = LiveMe

// Jibberish.
function createUUID(t) {
    var e, n, o = [], a = "0123456789abcdef";
    for (e = 0; e < 36; e++)
        o[e] = a.substr(Math.floor(16 * Math.random()), 1);
    return o[14] = "4",
    o[19] = a.substr(3 & o[19] | 8, 1),
    t ? n = o.join("").substr(0, 32) : (o[8] = o[13] = o[18] = o[23] = "-",
    n = o.join("")),
    n
}