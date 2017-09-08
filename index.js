'use strict';
/*

	  _     _           __  __           _    ____ ___ 
	 | |   (_)_   _____|  \/  | ___     / \  |  _ \_ _|
	 | |   | \ \ / / _ \ |\/| |/ _ \   / _ \ | |_) | | 
	 | |___| |\ V /  __/ |  | |  __/  / ___ \|  __/| | 
	 |_____|_| \_/ \___|_|  |_|\___| /_/   \_\_|  |___|
	                                                   	

*/

const	eventEmitter = new(require('events').EventEmitter)(), superagent = require('superagent');

module.exports = {
	events: eventEmitter,

	getUserInfo: function(uid) {
		superagent.get('http://live.ksmobile.net/user/getinfo')
			.query({
				userid: uid
			})
			.end((err, res) => {
				if (err) { 
					eventEmitter.emit('error', err); 
				} else {
					eventEmitter.emit('response', res.body);
				}
			});
	},

	getUserReplays: function(uid, page_index, page_size) {

	},
	
	searchByUsername: function(query) {

	},

	searchByHashtag: function(query, countryCode) {

	},

	/*
		For Live Video Playback
	*/
	getLive: function() {

	}
	
};






/*


var	callback_holder = null, query = '', query_orig = '', page_index = 0, return_data = [], index = 0, max_count = 0;
var build_table = [], build_table2 = [], video_count = 0, cancelLMTweb = false, searchType = 1;

var PAGE_SIZE = 5;		// The Higher the number, the less the calls to the server but the larger the progress steps...

function getuservideos (u, cb) {

	cancelLMTweb = false;
	query_orig = null;
	query = u;
	callback_holder = cb;
	return_data = {
		userinfo: {
			userid: 0
		},
		videos: []
	};

	if (query.length == 18) {		
		_dolookup1();
	} else if (query.length < 18) {
		cb(return_data);
	} else {
		query_orig = u;
		_dolookup();
	}

}

function searchkeyword(k, cb) {

	cancelLMTweb = false;
	query = k;
	callback_holder = cb;
	page_index = 1;
	searchType = 1;
	return_data = [];

	$('#overlay .status').html('<progress></progress><br>Searching for usernames matching query...');
	_dosearch(false);

}

function search_hashtag(k, cb) {

	cancelLMTweb = false;
	query = k;
	callback_holder = cb;
	page_index = 1;
	searchType = 2;
	return_data = [];

	$('#overlay .status').html('<progress></progress><br>Searching for hashtags matching query...');
	_dosearch(false);

}


function _dolookup() {

	$('#overlay .status').html('<progress></progress><br>Looking up Video ID...');
	$.ajax({
		url: 'http://live.ksmobile.net/live/queryinfo',
		data: {
			userid: 0,
			videoid: query
		},
		cache: false,
		type: "GET",
		dataType: "json",
		timeout: 15000,
		error: function(e){
			callback_holder(return_data);
		},
		success: function(e) {

			if (e.data.length == 0) {
				callback_holder(return_data);
				return;
			}

			if (typeof e.data.user_info !== undefined) {
				query = e.data.user_info.userid;
				_dolookup1();
			} else {
				callback_holder(return_data);
			}
			
		}
	});
}

function _dolookup1() {

	$('#overlay .status').html('<progress></progress><br>Getting user info...');
	$.ajax({
		url: 'http://live.ksmobile.net/user/getinfo',
		data: {
			userid: query
		},
		cache: false,
		type: "GET",
		dataType: "json",
		timeout: 15000,
		error: function(e){
			callback_holder(return_data);
		},
		success: function(e) {

			if (typeof e.data.user == "undefined") {
				callback_holder(return_data);
				return;
			}
			if (e.status != 500) {
				video_count = e.data.user.count_info.video_count > appSettings.get('downloads.replaycount') ? appSettings.get('downloads.replaycount') : e.data.user.count_info.video_count;
				return_data.userinfo = {
					userid: e.data.user.user_info.uid,
					username: e.data.user.user_info.nickname,
					sex: e.data.user.user_info.sex == 0 ? 'female' : 'male',
					usericon: e.data.user.user_info.face,
					level: parseInt(e.data.user.user_info.level),
					following: parseInt(e.data.user.count_info.following_count),
					fans: parseInt(e.data.user.count_info.follower_count)
				}
			}

			if (video_count > 0) {
				page_index = 1;
				_dolookup2();	
			} else {
				_dolookup3();
			}
		}
	});



}

function _dolookup2() {

	if (cancelLMTweb) {
		callback_holder(return_data);
		return;
	}

	$('#overlay .status').html('<progress value="'+((page_index - 1) * PAGE_SIZE)+'" max="'+video_count+'" min="0"></progress><br>Getting details on '+video_count+' replays...<br><br><input type="button" value="Cancel" onClick="cancelAction()">');
	$.ajax({
		url: 'http://live.ksmobile.net/live/getreplayvideos',
		data: {
			userid: query,
			page_size: PAGE_SIZE,
			page_index: page_index
		},
		cache: false,
		type: "GET",
		dataType: "json",
		timeout: 15000,
		error: function(e){
			callback_holder(return_data);
		},
		success: function(e) {

			if (e.data.length == 0) {
				_dolookup3();
				return;
			}

			if (typeof e.data.video_info !== undefined) {
				for (i = 0; i < e.data.video_info.length; i++) {
					return_data.videos.push({
						url : e.data.video_info[i].hlsvideosource,
						dt :  parseInt(e.data.video_info[i].vtime),
						deleted : false,
						title : e.data.video_info[i].title,
						length : parseInt(e.data.video_info[i].videolength),
						videoid : e.data.video_info[i].vdoid,
						plays : e.data.video_info[i].watchnumber,
						shares : e.data.video_info[i].sharenum,
						likes : e.data.video_info[i].likenum,
						location : { country: e.data.video_info[i].countryCode },
						msgfile : e.data.video_info[i].msgfile,
						private: false
					});

					//if (return_data.length >= parseInt(appSettings.get('downloads.replaycount')))  break;
				}


				if (e.data.video_info.length == PAGE_SIZE) {
					page_index++;
					_dolookup2();
				} else {
					_dolookup3();
				}
			} else {
				do_lookup3();
			}

		}
	});
}

function _dolookup3() {

	$('#overlay .status').html('<progress></progress><br>Finishing up...');
	
	if (query_orig == null) {
		callback_holder(return_data);
		return;
	}

	$.ajax({
		url: 'http://live.ksmobile.net/live/queryinfo',
		data: {
			userid: 0,
			videoid: query_orig
		},
		cache: false,
		type: "GET",
		dataType: "json",
		timeout: 15000,
		error: function(e){
			callback_holder(return_data);
		},
		success: function(e) {

			if (e.data.length == 0) {
				callback_holder(return_data);
				return;
			}

			var add = true;

			for (i = 0; i < return_data.videos.length; i++) {
				if (return_data.videos[i].videoid == e.data.video_info.vdoid) add = false;
			}
			
			if (add == true) {
				return_data.videos.push({
					url : e.data.video_info.hlsvideosource,
					dt :  parseInt(e.data.video_info.vtime),
					deleted : false,
					title : e.data.video_info.title,
					length : parseInt(e.data.video_info.videolength),
					videoid : e.data.video_info.vdoid,
					plays : e.data.video_info.watchnumber,
					shares : e.data.video_info.sharenum,
					likes : e.data.video_info.likenum,
					location : { country: e.data.video_info.countryCode },
					msgfile : e.data.video_info.msgfile,
					private: true
				});
			}
			$('#overlay .status').html('');			
			callback_holder(return_data);			
		}
	});


}


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
