const request = require('request-promise-native')

const API = 'https://live.ksmobile.net'
const URL = {
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

        if ( ! params.email || ! params.password) {
            throw new Error('You need to provide your Live.me email and password.')
        }

        // Login details
        this.email = params.email
        this.password = Buffer.from(params.password).toString('base64')
        // Userdata
        this.user = null
        // Tokens
        this.tuid = null
        this.token = null
        this.accessToken = null
        this.androidid = createUUID()
        this.thirdchannel = 6

    }

    fetch(method, params = {}) {
        return request(Object.assign({
            method: 'POST',
            url: URL[method] || method,
            headers: {
                d: Math.round(new Date().getTime() / 1000)
            },
            json: true,
            transform: function (body) {
                if (body.status != 200) {
                    throw new Error('Request failed.')
                }
                return body.data
            }
        }, params))
    }

    getAccessTokens() {
        return this.fetch('accessToken', {
            formData: {
                name: this.email,
                password: this.password,
                sr: 1
            }
        })
        .then(json => {
            // Set access token
            this.accessToken = json.access_token
            // Pass token to login
            return json.access_token
        })
        .then(accessToken => {
            // Login
            return this.fetch('channelLogin', {
                formData: {
                    access_token: accessToken,
                    thirdchannel: this.thirdchannel,
                    reg_type: 108,
                    androidid: this.androidid,
                    countrycode: ''
                }
            })
        })
        .then(json => {
            this.user = json.user
            this.tuid = json.user.uid
            this.token = json.token
            return json
        })
    }

    getUserInfo(userid) {
        if ( ! userid) {
            return new Error('Invalid userid.')
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
            return new Error('Invalid videoid.')
        }

        return this.fetch('videoInfo', {
            formData: {
                userid: 0,
                videoid
            }
        })
        .then(json => {
            return json.video_info
        })
    }

    getUserReplays(userid, page_index = 1, page_size = 10) {
        if ( ! userid) {
            return new Error('Invalid userid.')
        }

        if ( ! this.user) {
            return this.getAccessTokens().then(() => this.getUserReplays(userid, page_index, page_size))
        }

        return this.fetch('replayVideos', {
            formData: {
                userid,
                page_index,
                page_size,
                tuid: this.tuid,
                token: this.token,
                androidid: this.androidid,
                thirdchannel: this.thirdchannel
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
            return new Error('Type must be 1 or 2.')
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
            return new Error('Invalid access_token (userid).')
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
            return new Error('Invalid access_token (userid).')
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