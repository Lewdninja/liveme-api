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
        // Tokens
        this.tuid = null
        this.token = null
        this.accessToken = null
        this.androidid = createUUID()

    }

    fetch(method, params = {}) {
        return request(Object.assign({
            method: 'POST',
            url: URL[method],
            headers: {
                d: Math.round(new Date().getTime() / 1000)
            },
            json: true,
            transform: function (body) {
                if (body.status != 200) {
                    throw new Error('Request failed.')
                }
            }
        }, params))
    }

    getAccessToken() {
        return this.fetch('accessToken', {
            formData: {
                name: this.email,
                password: this.password,
                sr: 1
            }
        })
        .then(json => {
            // Set tokens
            this.accessToken = json.access_token
            // Return data
            return json.data
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