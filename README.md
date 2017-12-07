# LiveMe API for Node
[![NPM](https://nodei.co/npm/liveme-api.png)](https://nodei.co/npm/liveme-api/)

[![Build Status](https://img.shields.io/travis/thecoder75/liveme-api.svg?label=Build%20Status)](https://travis-ci.org/thecoder75/liveme-api)
[![dependencies](https://img.shields.io/david/expressjs/express.svg?label=Dependencies)](https://david-dm.org/thecoder75/liveme-api)
[![npm](https://img.shields.io/npm/v/liveme-api.svg?label=Current%20Version)](https://www.npmjs.com/package/liveme-api)
[![npm](https://img.shields.io/npm/dt/liveme-api.svg?label=Downloads)](https://www.npmjs.com/package/liveme-api)



## Installation
`npm install liveme-api`
or
`yarn install liveme-api`

## Usage

Below is a basic example on how to use the LiveMe-API in your project.  See the [Reference Manual](https://github.com/thecoder75/liveme-api/blob/master/docs/index.md) for details on each supported command.

For a complete example on how this module can be used, see the [LiveMe Tools](https://github.com/thecoder75/liveme-tools/) source for complete details.

### Basic Example:

```javascript
const LiveMeAPI = require('liveme-api');

livemeapi.getUserInfo('1234567890123456')
	.then(user => {
		//   user.user_info contains details on the user queried
	})
	.catch(err => {
		// Unable to locate user account
	});

```

## Developers
* [thecoder75](https://github.com/thecoder75)
* [polydragon](https://github.com/polydragon)

## License
This project is licensed under the GPL-3 License - see the [LICENSE](LICENSE)
file for details
