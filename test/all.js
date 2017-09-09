// all.js

var livemeapi = require('../index'), return_code = 0;


// LiveMe Academy: 828324394803003392
var userInfo = livemeapi.getUserInfoSync('828324394803003392');
userInfo.then((res) => {
	if (res.user.user_info.uid != '828324394803003392') {
		return_code = 1;
	} else {
		console.log('getuserInfoSync passed, got user details back.');		
	}
});

// Test Video: 15015379476728257645 - Live.me Broadcaster Adademy #training
console.log('\nChecking getVideoInfoSync...');
var videoInfo = livemeapi.getVideoInfoSync('15015379476728257645');
videoInfo.then((res) => {
	if (res.video_info.vid != '15015379476728257645') {
		return_code = 1;
	} else {
		console.log('getVideoInfoSync passed, got video details back.');
	}
});

// LiveMe Academy: 828324394803003392
var replays = livemeapi.getUserReplaysSync('828324394803003392', 1, 2);
replays.then((res) => {
	if (res.video_info.length == 0) {
		return_code = 1;
	} else {
		console.log('getUserReplaysSync passed, got an array of replays.');
	}
});


return return_code;