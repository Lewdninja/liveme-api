'use strict';
/*

	  _     _           __  __           _    ____ ___ 
	 | |   (_)_   _____|  \/  | ___     / \  |  _ \_ _|
	 | |   | \ \ / / _ \ |\/| |/ _ \   / _ \ | |_) | | 
	 | |___| |\ V /  __/ |  | |  __/  / ___ \|  __/| | 
	 |_____|_| \_/ \___|_|  |_|\___| /_/   \_\_|  |___|
	                                                   	

*/

const axios = require('axios');

/* 
	Constants
*/
const LM_GETUSERINFO = 'http://live.ksmobile.net/user/getinfo',
	LM_GETVIDEOINFO = 'http://live.ksmobile.net/live/queryinfo',
	LM_GETREPLAYVIDEOS = 'http://live.ksmobile.net/live/getreplayvideos',
	LM_KEYWORDSEARCH = 'http://live.ksmobile.net/search/searchkeyword',
	LM_GETLIVEUSERS = 'https://live.ksmobile.net/live/newmaininfo';

/*
	Local Functions

	AXIOS is built for use with Promise so it works perfectly here
	plus doesn't require too f**king many modules like some others
*/

function httpGet(url, params = {}) {
	return axios.get(url, params)
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
		uid: string
		Returns: Promise of a User object
	*/
	getUserInfo: function (uid) {

		if (typeof uid == 'undefined' || uid == null) {
			console.log('FATAL ERROR: Must pass a valid UID parameter to getVidegetUserInfooInfo.');
			return false;
		}

		return httpGet(`${LM_GETUSERINFO}?userid=${uid}`)
			.then(data => {
				if (data.status == '200') {
					return data.data.user;
				} else {
					return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
				}
			});
	},

	/*
		vid: number
		Returns: Promise of a Video object
	*/
	getVideoInfo: function (vid) {

		if (typeof vid == 'undefined' || vid == null) {
			console.log('FATAL ERROR: Must pass a valid VID parameter to getVideoInfo.');
			return false;
		}
		return httpGet(`${LM_GETVIDEOINFO}?userid=0&videoid=${vid}`)
			.then(data => {
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
		uid: number
		page: number (default 1)
		count: number (default 10)
		Returns: Promise of an array of Video objects
	*/
	getUserReplays: function (uid, page, count) {


		if (typeof uid == 'undefined' || uid == null) {
			console.log('FATAL ERROR: Must pass a valid UID parameter to getVidegetUserInfooInfo.');
			return false;
		}
		if (typeof page == 'undefined' || page == null) { page = 1; }
		if (typeof count == 'undefined' || count == null) { count = 10; }

		return httpGet(`${LM_GETREPLAYVIDEOS}?userid=${uid}&page_size=${count}&page_index=${page}`)
			.then(data => {
				if (data.status == 200) {
					return data.data.video_info;
				} else {
					return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
				}
			});
		
	},

	/*
		query: (u)rl for the chat json file

		Returns: An array of message entries
	*/
	getChatHistoryForVideo(u) {
		return axios.get(u)
			.then(response => {
				var list = [],t = response.split('\n');
				try {
					for (var l in t)
						list.push(JSON.parse(l));
					return list;
				} catch(er) {
					return false;
				}
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
		if (typeof page == 'undefined' || page == null) { page = 1; }
		if (typeof count == 'undefined' || count == null) { count = 10; }
		if (typeof type == 'undefined' || type == null) { type = 0; }

		if (page <= 0) {
			console.log('FATAL ERROR: Page must be equal or greater than 1.');
			return false;
		}

		if (Count <= 0) {
			console.log('FATAL ERROR: Count must be equal or greater than 1.');
			return false;
		}

		if (type < 1 || type > 2) {
			console.log('FATAL ERROR: Type must be 1 or 2');
			return false;
		}

		// country is optional and if not specified then it won't hurt anything
		return httpGet(`${LM_KEYWORDSEARCH}?keyword=${query}&type=${type}&page_size=${count}&page_index=${page}&countryCode=${country}`)
			.then(data => {
				if (data.status == 200) {
					return data.data.data_info;
				} else {
					return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
				}
			});
	},


	/*
		page: number (default 1)
		count: number (default 1)
	*/
	getLive: function (page, count) {
		if (typeof page == 'undefined' || page == null) { page = 1; }
		if (typeof count == 'undefined' || count == null) { count = 10; }

		if (page <= 0) {
			console.log('FATAL ERROR: Page must be equal or greater than 1.');
			return false;
		}

		if (Count <= 0) {
			console.log('FATAL ERROR: Count must be equal or greater than 1.');
			return false;
		}

		return httpGet(`${LM_GETLIVEUSERS}?page_size=${count}&page_index=${page}`)
			.then(data => {
				if (data.status == 200) {
					return data.data.video_info;
				} else {
					return Promise.reject(`Error: ${data.status} Message: ${data.msg}`);
				}
			});

	}

};

