// all.js

var livemeapi = require('../index'), return_code = 0;

let uidTest = '828324394803003392'; // LiveMe Academy: 828324394803003392
let vidTest = '15015379476728257645'; // Test Video: 15015379476728257645 - Live.me Broadcaster Adademy #training

livemeapi.getUserInfo(uidTest)
	.then(user => {
		if (user.user_info.uid != uidTest) {
			console.log(`getUserInfo() failed, ${uidTest} does not equal ${user.user_info.uid}`);
			return_code = 1;
		} else {
			console.log('getUserInfo() passed, got user details back.');
		}
	})
	.catch(err => {
		console.log(`getUserInfo() failed, ${err}`);
		return_code = 1;
	});

livemeapi.getVideoInfo(vidTest)
	.then(video => {
		if (video.vid != vidTest) {
			console.log(`getVideoInfo() failed, ${vidTest} does not equal ${video.vid}`);
			return_code = 1;
		} else {
			console.log('getVideoInfo() passed, got user details back.');
		}
	})
	.catch(err => {
		console.log(`getVideoInfo() failed, ${err}`);
		return_code = 1;
	})

livemeapi.getUserReplays(uidTest)
	.then(replays => {
		if (replays.length > 0) {
			console.log('getUserReplays() passed, got array of replays.');
		} else {
			console.log(`getUserReplays() failed, ${replays.length} replays returned`);
			return_code = 1;
		}
	})
	.catch(err => {
		console.log(`getUserReplays() failed, ${err}`);
		return_code = 1;
	});

/*

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
});*/


return return_code;