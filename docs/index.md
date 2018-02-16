---
layout: default
title: LiveMe API
description: A node module designed to make querying and using Live.me video social network easy.
---
[![Build Status](https://img.shields.io/travis/thecoder75/liveme-api.svg?label=Build%20Status&style=flat-squar)](https://travis-ci.org/thecoder75/liveme-api)
[![dependencies](https://img.shields.io/david/expressjs/express.svg?label=Dependencies&style=flat-squar)](https://david-dm.org/thecoder75/liveme-api)
![release](https://img.shields.io/github/release/thecoder75/liveme-api.svg?style=flat-square)
![node-version](https://img.shields.io/node/v/liveme-api.svg?style=flat-square)

## Installation
![total-downloads](https://img.shields.io/npm/dt/liveme-api.svg?style=flat-square)
![yearly-downloads](https://img.shields.io/npm/dy/liveme-api.svg?style=flat-square)
![monthly-downloads](https://img.shields.io/npm/dm/liveme-api.svg?style=flat-square)
![weekly-downloads](https://img.shields.io/npm/dw/liveme-api.svg?style=flat-square)

You can install using either `npm` or `yarn` as shown below:
```
npm install liveme-api
```
or
```
yarn add liveme-api
```

## Projects Using This Module

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

### Detailed Command Documentation

We have documented all of the exposed commands [here](api.md) for easy reading.

### Maintainers
* [thecoder75](https://github.com/thecoder75)
* [polydragon](https://github.com/polydragon)

### Contributing
If you would like to contribute to this project, please submit a pull request with your code updates.  We ask that you adhere to our coding style and follow our file layout design.
