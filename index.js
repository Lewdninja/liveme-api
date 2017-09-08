'use strict';
/*

	  _     _           __  __           _    ____ ___ 
	 | |   (_)_   _____|  \/  | ___     / \  |  _ \_ _|
	 | |   | \ \ / / _ \ |\/| |/ _ \   / _ \ | |_) | | 
	 | |___| |\ V /  __/ |  | |  __/  / ___ \|  __/| | 
	 |_____|_| \_/ \___|_|  |_|\___| /_/   \_\_|  |___|
	                                                   	

*/

const	eventEmitter = new(require('events').EventEmitter)(), superagent = require('superagent'), nocache = require('superagent-no-cache')

module.exports = {
	events: eventEmitter,

	getUserInfo: function(uid) {
		superagent.get('http://live.ksmobile.net/user/getinfo')
			.query({
				userid: uid
			})
			.use(nocache)
			.end((err, res) => {
				if (err) { 
					eventEmitter.emit('error', err); 
				} else {
					eventEmitter.emit('data', res.body.data);
				}
			});
	},

	getVideoInfo: function(vid) {
		superagent.get('http://live.ksmobile.net/live/queryinfo')
			.query({
				userid: 0,
				videoid: vid
			})
			.use(nocache)
			.end((err, res) => {
				if (err) { 
					eventEmitter.emit('error', err); 
				} else {
					eventEmitter.emit('data', res.body.data);
				}
			});
	}

	getUserReplays: function(uid, page, count) {
		if (typeof page == 'undefined') { page = 1; }
		if (typeof count == 'undefined') { count = 10; }

		superagent.get('http://live.ksmobile.net/live/getreplayvideos')
			.query({
				userid: uid,
				page_size: page,
				page_index: count
			})
			.use(nocache)
			.end((err, res) => {
				if (err) { 
					eventEmitter.emit('error', err); 
				} else {
					eventEmitter.emit('data', res.body.data);
				}
			});
	},
	
	performSearch: function(query, page, count, type, country) {
		if (typeof page == 'undefined') { page = 1; }
		if (typeof count == 'undefined') { count = 10; }
		if (typeof type == 'undefined') { type = 0; }
		if (typeof country == 'undefined') { country = 'US'; }

		superagent.get('http://live.ksmobile.net/live/getreplayvideos')
			.query({
				userid: uid,
				page_size: page,
				page_index: count,
				type: type,
				countryCode: country
			})
			.use(nocache)
			.end((err, res) => {
				if (err) { 
					eventEmitter.emit('error', err); 
				} else {
					eventEmitter.emit('data', res.body.data);
				}
			});

	},
	
	getLive: function() {

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
