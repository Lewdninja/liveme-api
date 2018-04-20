const request = require('request-promise-native')

const API = 'https://live.ksmobile.net'
const URL = {
    getAccessToken: `${API}/channel/signin`,
    getChannelLogin: `${API}/channel/login`,
    getUserInfo: `${API}/user/getinfo`,
    getVideoInfo: `${API}/live/queryinfo`,
    getReplayVideos: `${API}/live/getreplayvideos`,
    keywordSearch: `${API}/search/searchkeyword`,
    getLiveUsers: `${API}/live/newmaininfo`,
    getFans: `${API}/follow/getfollowerlistship`,
    getFollowing: `${API}/follow/getfollowinglistship`,
    getTrendingHashtags: `${API}/search/getTags`,
    getLiveBoys: `${API}/live/boys`,
    getLiveGirls: `${API}/live/girls`,
}

class LiveMe {

    constructor(params = {}) {

        if ( ! params.email || ! params.password) {
            throw new Error('You need to provide your Live.me email and password.')
        }

        // Login details
        this.email = params.email
        this.password = params.password
        // Tokens
        this.tuid = null
        this.token = null
        this.androidid = createUUID()

    }

    fetch(url, params = {}) {
        return request({
            method: 'POST',
            headers: {
                d: Math.round(new Date().getTime() / 1000)
            },
            ...params
        })
    }

    getAccessToken(params = {}) {

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