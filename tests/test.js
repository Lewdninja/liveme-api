// all.js

var livemeapi = require('../index'), return_code = 0;

let uidTest = '733517570313158656'; 
let vidTest = '14981460596257911405'; 

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

livemeapi.performSearch('Live.me%20Academy', 1, 10, 1)
	.then(results => {
		if (results.length > 0) {
			console.log('performSearch() query test passed, got array of results.');
		} else {
			console.log(`performSearch() query test failed, ${results.length} results returned`);
			return_code = 1;
		}
	})
	.catch(err => {
		console.log(`performSearch() query test failed, ${err}`);
		return_code = 1;
	});

livemeapi.performSearch('training', 1, 10, 2)
	.then(results => {
		if (results.length > 0) {
			console.log('performSearch() hashtag test passed, got array of results.');
		} else {
			console.log(`performSearch() hashtag test failed, ${results.length} results returned`);
			return_code = 1;
		}
	})
	.catch(err => {
		console.log(`performSearch() hashtag test failed, ${err}`);
		return_code = 1;
	});


livemeapi.getLive(1, 10)
	.then(results => {
		if (results.length > 0) {
			console.log('getLive() passed, got array of videos.');
		} else {
			console.log(`getLive() failed, ${results.length} videos returned`);
			return_code = 1;
		}
	})
	.catch(err => {
		console.log(`getLive() failed, ${err}`);
		return_code = 1;
	});


return return_code;