'use strict';
/*

	  _     _           __  __           _    ____ ___ 
	 | |   (_)_   _____|  \/  | ___     / \  |  _ \_ _|
	 | |   | \ \ / / _ \ |\/| |/ _ \   / _ \ | |_) | | 
	 | |___| |\ V /  __/ |  | |  __/  / ___ \|  __/| | 
	 |_____|_| \_/ \___|_|  |_|\___| /_/   \_\_|  |___|
	                                                   	

*/

const superagent = require('superagent'), nocache = require('superagent-no-cache')

/* 
	Constants
*/
const LM_GETUSERINFO = 'http://live.ksmobile.net/user/getinfo',
	LM_GETVIDEOINFO = 'http://live.ksmobile.net/live/queryinfo',
	LM_GETREPLAYVIDEOS = 'http://live.ksmobile.net/live/getreplayvideos',
	LM_KEYWORDSEARCH = 'http://live.ksmobile.net/search/searchkeyword';

/*
	Local Functions
*/

function httpGet(url, query) {
	return new Promise((resolve, reject) => {
		superagent.get(url).query(query).use(nocache).end((err, res) => {
			if (err) {
				return reject(err);
			} else {
				return promise(res.body.data);
			}
		});
	});
}

/*
	Exported Functions
*/

module.exports = {
	/*
		uid: number
		Returns: Promise of a User object
	*/
	getUserInfo: function (uid) {
		return new Promise((resolve, reject) => {
			if (typeof uid == 'undefined' || uid == null || uid <= 0) {
				return reject('Invalid user ID');
			}

			return resolve();
		}).then(() => {
			return httpGet(LM_GETUSERINFO, { userid: uid })
		})
			.then(data => {
				return data; // TODO: return an actual user object
			});
	},

	/*
		Synchronous version of `getUserInfo`
		uid: number
		Returns: User object, null on failure
	*/
	getUserInfoSync: async function (uid) {
		return await this.getUserInfo(uid)
			.catch(err => {
				return null;
			});
	},

	/*
		vid: number
		Returns: Promise of a Video object
	*/
	getVideoInfo: function (vid) {
		return httpGet(LM_GETVIDEOINFO, { userid: 0, videoid: vid })
			.then(data => {
				return data; // TODO: return an actual video object
			})
			.catch(err => {
				return null;
			});
	},

	/*
		Synchronous version of `getVideoInfo`
		vid: number
		Returns: Video object, null on failure
	*/
	getVideoInfoSync: async function (vid) {
		return await this.getVideoInfo(vid);
	},

	/*
		uid: number
		page: number (default 1)
		count: number (default 10)
		Returns: Promise of an array of Video objects
	*/
	getUserReplays: function (uid, page, count) {
		return new Promise((resolve, reject) => {
			if (typeof page == 'undefined' || page == null) { page = 1; }
			if (typeof count == 'undefined' || count == null) { count = 10; }

			if (page <= 0) {
				return reject('Page must be greater than 0');
			}

			if (count <= 0) {
				return reject('Count must be greater than 0');
			}

			return resolve();
		}).then(() => {
			return httpGet(LM_GETREPLAYVIDEOS, { userid: uid, page_size: page, page_index: count });
		}).then(data => {
			return data; // TODO: return array of Video objects
		});
	},

	/*
		Synchronous version of `getUserReplays`
		uid: number
		page: number (default 1)
		count: number (default 10)
		Returns: An array of Video objects, null on failure
	*/
	getUserReplaysSync: function (uid, page, count) {
		return this.getUserReplays(uid, page, count)
			.catch(err => {
				return null;
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
			if (typeof page == 'undefined' || page == null) { page = 1; }
			if (typeof count == 'undefined' || count == null) { count = 10; }
			if (typeof type == 'undefined' || type == null) { type = 0; }
			if (typeof country == 'undefined' || country == null) { country = 'US'; }

			if (page <= 0) {
				return reject('Page must be greater than 0');
			}

			if (count <= 0) {
				return reject('Count must be greater than 0');
			}

			if (type < 1 || type > 2) {
				return reject('Count must be 1 or 2');
			}

			// TODO: Maybe check country code? Doubt it's needed.
			
			return resolve();
		}).then(() => {
			return httpGet(LM_KEYWORDSEARCH, { userid: uid, page_index: page, page_size: count, type: type, countryCode: country });
		}).then(data => {
			if (type == 1) { // list of users
				return data; // TODO: return array of User objects
			} else if (type == 2) { // Video #tag search.
				return data; // TODO: return array of Video objects
			}
		});

	},

	getLive: function () {

	}

};






/*

function _dosearch(showOverlay=true) {

	if (showOverlay) {
		$('#overlay .status').html('<progress></progress><br>Found '+(return_data.length)+' matching query...');
	}

	$.ajax({
		url: 'http://live.ksmobile.net/search/searchkeyword',
		data: {
			keyword: encodeURI(query),
			page_size: PAGE_SIZE,
			page_index: page_index,
			type : searchType
		},
		cache: false,
		type: "GET",
		dataType: "json",
		timeout: 15000,
		error: function(e){
			callback_holder(return_data);
		},
		success: function(e) {

			if (e.data.data_info.length == 0) {
				callback_holder(return_data);
				return;
			} else {
				for (i = 0; i < e.data.data_info.length; i++) {
					// Only push ones that are defined.
					if (typeof e.data.data_info[i] != 'undefined') {

						if (searchType == 1) {
							return_data.push({
								userid : e.data.data_info[i].user_id
							});
						} else {
							return_data.push(e.data.data_info[i]);
						}
					}
				}

				// Even with this code is here it still will only return 10 results max.
				if (e.data.data_info.length == PAGE_SIZE) {
					page_index++;
					_dosearch();
				} else {
					index = 0;
					if (searchType == 1) {
						_dosearch2();
					} else {
						callback_holder(return_data);
					}
				}
			}
		}
	});


}

function _dosearch2() {

	$('#overlay .status').html('<progress min="0" max="'+return_data.length+'" value="'+index+'"></progress><br>Getting info on '+return_data.length+' users...');
	$.ajax({
		url: 'http://live.ksmobile.net/user/getinfo',
		data: {
			userid: return_data[index].userid
		},
		cache: false,
		type: "GET",
		dataType: "json",
		timeout: 15000,
		error: function(e){
			callback_holder(return_data);
		},
		success: function(e) {
			return_data[index] = {
					userid: e.data.user.user_info.uid,
					nickname: e.data.user.user_info.nickname,
					sex: e.data.user.user_info.sex < 0 ? '' : ( e.data.user.user_info.sex == 0 ? 'female' : 'male'),
					face: e.data.user.user_info.face,
					level: parseInt(e.data.user.user_info.level),
					followings: parseInt(e.data.user.count_info.following_count),
					fans: parseInt(e.data.user.count_info.follower_count),
					videos : [],
					videosplus : false
			};
			

			index++;
			if (index < return_data.length) {
				_dosearch2();
			} else {
				index = 0;
				// We return data instead of getting videos
				callback_holder(return_data);
			}

		}
	});
}





function getChat(u, cb) {
	callback_holder = cb;
	
	$.ajax({
		url: u,
		cache: false,
		type: "GET",
		dataType: "text",
		timeout: 15000,
		error: function(e) {
			callback_holder(false);
		},
		success: function(e) {
			var messageList = [];
			var split = e.split('\n');

			for (var i = 0; i < split.length; i++) {
				try {
					var lineObj = JSON.parse(split[i]);
					messageList.push(lineObj);
				} catch (er) {
					// just ignore it, sometimes it returns malformed json
				}
			}

			callback_holder(messageList);
		}
	});
}


*/
