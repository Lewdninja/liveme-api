'use strict';
/*
	  _     _           __  __           _    ____ ___
	 | |   (_)_   _____|  \/  | ___     / \  |  _ \_ _|
	 | |   | \ \ / / _ \ |\/| |/ _ \   / _ \ | |_) | |
	 | |___| |\ V /  __/ |  | |  __/  / ___ \|  __/| |
	 |_____|_| \_/ \___|_|  |_|\___| /_/   \_\_|  |___|
	                                            v2.0.0     	
*/

const   axios = require('axios'), crypto = require('crypto');

/*
	Constants
*/
const   LM_GETACCESSTOKEN = 'https://live.ksmobile.net/channel/signin',
        LM_GETCHANNELLOGIN = 'https://live.ksmobile.net/channel/login',
        LM_GETUSERINFO = 'https://live.ksmobile.net/user/getinfo',
        LM_GETVIDEOINFO = 'https://live.ksmobile.net/live/queryinfo',
        LM_GETREPLAYVIDEOS = 'https://live.ksmobile.net/live/getreplayvideos',
        LM_KEYWORDSEARCH = 'https://live.ksmobile.net/search/searchkeyword',
        LM_GETLIVEUSERS = 'https://live.ksmobile.net/live/newmaininfo',
        LM_GETFANS = 'https://live.ksmobile.net/follow/getfollowerlistship',
        LM_GETFOLLOWING = 'https://live.ksmobile.net/follow/getfollowinglistship',
        LM_GETTRENDINGHASHTAGS = 'https://live.ksmobile.net/search/getTags',
        LM_GETLIVEGIRLS = 'https://live.ksmobile.net/live/girls',
        LM_GETLIVEBOYS = 'https://live.ksmobile.net/live/boys';

/*
	Local Functions
*/

function httpGet(url, params = {}) {
    var dt = new Date();
    axios.defaults.headers.common['d'] = Math.round(dt.getTime() / 1000);
    return axios.post(url, params)
        .then(response => {
            if (response.status == 200) {
                return response.data;
            } else {
                return reject(`HTTP Error: ${response.status}`);
            }
        });
}

/*
	Exported Functions
*/
module.exports = {

    /*
        email: string
        password: string

        Returns: access token
    */
    getAccessToken: function(email, password) {
        return new Promise((resolve, reject) => {
            if (typeof email == 'undefined' || email == null) {
                return reject('Must pass an email address to getAccessToken(email, password)');
            }
            if (typeof password == 'undefined' || password == null) {
                return reject('Must pass a password to getAccessToken(email, password)');
            }

            return resolve();
        }).then(()=>{
            var passmd5 = crypto.createHash('md5').update(password).digest("hex");
            return httpGet(`${LM_GETACCESSTOKEN}?email=${email}&password=${passmd5}`);
        }).then(data => {
            if (data.status == '200') {
                return data.data.access_token;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
            
        });
    },



    /*
        access_token: string

        Returns: Promise of a User object
    */
    getChannelLogin: function(access_token) {
        return new Promise((resolve, reject) => {
            if (typeof access_token == 'undefined' || access_token == null) {
                return reject('Must pass an access token to getChannelLogin(access_token)');
            }
            return resolve();
        }).then(()=>{
            var uuid = createUUID();
            return httpGet(`${LM_GETCHANNELLOGIN}?access_token=${access_token}&thirdchannel=6&reg_type=108&androidid=~{uuid}&countrycode=`);
        }).then(data => {
            if (data.status == '200') {
                return data.data.user;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
            
        });
    },



	/*
		uid: string
		Returns: Promise of a User object
	*/
    getUserInfo: function (uid) {
        return new Promise((resolve, reject) => {
            if (typeof uid == 'undefined' || uid == null) {
                return reject('Must pass a valid UID parameter to getUserInfo(uid)');
            }

            return resolve();
        }).then(() => {
            return httpGet(`${LM_GETUSERINFO}?userid=${uid}`);
        }).then(data => {
            if (data.status == '200') {
                return data.data.user;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
        });
    },

	/*
		vid: string
		Returns: Promise of a Video object
	*/
    getVideoInfo: function (vid) {
        return new Promise((resolve, reject) => {
            if (typeof vid == 'undefined' || vid == null) {
                return reject('Must pass a valid VID parameter to getVideoInfo(vid)');
            }

            return resolve();
        }).then(() => {
            return httpGet(`${LM_GETVIDEOINFO}?userid=0&videoid=${vid}`);
        }).then(data => {
            if (data.status == '200') {
                if (data.data.video_info.vid == null) {
                    return Promise.reject('Error: 500 Message: Video does not exist'); // For some reason they send back empty data instead of saying it doesn't exist.
                }

                return data.data.video_info;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
        });
    },

	/*
		uid: string
		page: number (default 1)
		count: number (default 10)
		Returns: Promise of an array of Video objects
	*/
    getUserReplays: function (uid, page, count) {
        return new Promise((resolve, reject) => {
            if (typeof uid == 'undefined' || uid == null) {
                return reject('Must pass a valid UID parameter to getUserReplays(uid, page, count).');
            }

            if (typeof page == 'undefined' || page == null) {
                page = 1;
            }

            if (typeof count == 'undefined' || count == null) {
                count = 10;
            }

            return resolve();
        }).then(() => {
            return httpGet(`${LM_GETREPLAYVIDEOS}?userid=${uid}&page_size=${count}&page_index=${page}`);
        }).then(data => {
            if (data.status == 200) {
                return data.data.video_info;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
        });
    },

	/*
		url: url for the chat json file

		Returns: An array of message entries
	*/
    getChatHistoryForVideo(url) {
        return axios.get(url)
            .then(response => {
                return response;
            });
    },

    /*
        same as above, just worded more correctly
    */
    getCommentHistoryForReplay(url) {
        return axios.get(url)
            .then(response => {
                return response;
            });
    },

	/*
		query: string
		page: number (default 1)
		count: number (default 10)
		type: number [1|2] (default 1)
		country: string [2 letter country code] (default US)
		Returns: Promise of an array of Video objects
	*/
    performSearch: function (query, page, count, type, country) {
        return new Promise((resolve, reject) => {
            if (typeof page == 'undefined' || page == null) {
                page = 1;
            }

            if (typeof count == 'undefined' || count == null) {
                count = 10;
            }

            if (typeof type == 'undefined' || type == null) {
                type = 0;
            }

            if (page <= 0) {
                return reject('Page must be equal or greater than 1.');
            }

            if (count <= 0) {
                return reject('Count must be equal or greater than 1.');
            }

            if (type < 1 || type > 2) {
                return reject('Type must be 1 or 2');
            }

            return resolve();
        }).then(() => {
            const encodedQuery = encodeURIComponent(query);
            return httpGet(`${LM_KEYWORDSEARCH}?keyword=${encodedQuery}&type=${type}&pagesize=${count}&page=${page}&countryCode=${country}`);
        }).then(data => {
            if (data.status == 200) {
                return data.data.data_info;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
        });
    },

    getLive: function (page, count, country) {
        return new Promise((resolve, reject) => {
            if (typeof page == 'undefined' || page == null) {
                page = 1;
            }

            if (typeof count == 'undefined' || count == null) {
                count = 10;
            }

            if (page <= 0) {
                return reject('Page must be equal or greater than 1');
            }

            if (count <= 0) {
                return reject('Count must be equal or greater than 1');
            }

            return resolve();
        }).then(() => {
            return httpGet(`${LM_GETLIVEUSERS}?page_size=${count}&page_index=${page}&countryCode=${country}`);
        }).then(data => {
            if (data.status == 200) {
                return data.data.video_info;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
        });
    },

    getFans: function (uid, page, size) {
        return new Promise((resolve, reject) => {
            if (typeof page == 'undefined' || page == null) {
                page = 1;
            }

            if (typeof size == 'undefined' || size == null) {
                size = 10;
            }

            if (page <= 0) {
                return reject('Page must be equal or greater than 1');
            }

            if (size <= 0) {
                return reject('Count must be equal or greater than 1');
            }

            if (typeof uid == 'undefined' || uid == null) {
                return reject('Must pass a valid UID parameter to getFans(uid)');
            }

            return resolve();
        }).then(() => {
            return httpGet(`${LM_GETFANS}?access_token=${uid}&page_size=${size}&page_index=${page}`);
        }).then(data => {
            if (data.status == '200') {
                return data.data;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
        });
    },

    getFollowing: function (uid, page, size) {
        return new Promise((resolve, reject) => {
            if (typeof page == 'undefined' || page == null) {
                page = 1;
            }

            if (typeof size == 'undefined' || size == null) {
                size = 10;
            }

            if (page <= 0) {
                return reject('Page must be equal or greater than 1');
            }

            if (size <= 0) {
                return reject('Count must be equal or greater than 1');
            }

            if (typeof uid == 'undefined' || uid == null) {
                return reject('Must pass a valid UID parameter to getFollowing(uid)');
            }

            return resolve();
        }).then(() => {
            return httpGet(`${LM_GETFOLLOWING}?access_token=${uid}&page_size=${size}&page_index=${page}`);
        }).then(data => {
            if (data.status == '200') {
                return data.data;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
        });
    },

    getTrendingHashtags: function () {
        return httpGet(LM_GETTRENDINGHASHTAGS)
            .then(data => {
                if (data.status == 200) {
                    return data.data;
                } else {
                    return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
                }
            });
    },

    getLiveGirls: function(page, size, country) {
        return new Promise((resolve, reject) => {
            if (typeof page == 'undefined' || page == null) {
                page = 1;
            }

            if (typeof size == 'undefined' || size == null) {
                size = 10;
            }

            if (page <= 0) {
                return reject('Page must be equal or greater than 1');
            }

            if (size <= 0) {
                return reject('Size must be equal or greater than 1');
            }

            return resolve();
        }).then(() => {
            return httpGet(`${LM_GETLIVEGIRLS}?page_size=${size}&page=${page}&countryCode=${country}`);
        }).then(data => {
            if (data.status == 200) {
                return data.data;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
            }
        });
    },

    getLiveBoys: function(page, size, country) {
        return new Promise((resolve, reject) => {
            if (typeof page == 'undefined' || page == null) {
                page = 1;
            }

            if (typeof size == 'undefined' || size == null) {
                size = 10;
            }

            if (page <= 0) {
                return reject('Page must be equal or greater than 1');
            }

            if (size <= 0) {
                return reject('Size must be equal or greater than 1');
            }

            return resolve();
        }).then(() => {
            return httpGet(`${LM_GETLIVEBOYS}?page_size=${size}&page=${page}`);
        }).then(data => {
            if (data.status == 200) {
                return data.data;
            } else {
                return Promise.reject(`Error: ${data.status} Message: ${data.msg}&countryCode=${country}`);
            }
        });
    }
};



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