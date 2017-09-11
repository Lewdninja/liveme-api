# LiveMe API for Node
[![NPM](https://nodei.co/npm/liveme-api.png)](https://nodei.co/npm/liveme-api/)

[![Build Status](https://travis-ci.org/thecoder75/liveme-api.svg?branch=master)](https://travis-ci.org/thecoder75/liveme-api)
[![Dependency Status](https://david-dm.org/thecoder75/liveme-api.svg)](https://david-dm.org/thecoder75/liveme-api)
[![npm](https://img.shields.io/npm/v/liveme-api.svg)](https://www.npmjs.com/package/liveme-api)
[![npm](https://img.shields.io/npm/dt/liveme-api.svg)](https://www.npmjs.com/package/liveme-api)


## Installation
`npm install liveme-api`

## Usage

Below is a basic example on how to use the LiveMe-API in your project.  See the [Reference Manual](https://github.com/thecoder75/liveme-api/blob/beta/docs/index.md) for details on each supported command.

***API syntax and available commands are subject to change as we continue to research and improve this module!***

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

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) 
for details on our code of conduct, and the process for submitting pull 
requests to us.

To become a contributor, please message TheCoder75 (thecoder1975@gmail.com).

## Developers
* [thecoder75](https://github.com/thecoder75)
* [polydragon](https://github.com/polydragon)

## License
This project is licensed under the GPL3 License - see the [LICENSE](LICENSE) 
file for details
