Modified version of the [original module](https://github.com/thecoder75/liveme-api) by [thecoder75](https://github.com/thecoder75)

```javascript
const LivemeAPI = require('liveme-api')
const Liveme = new LivemeAPI({
    email: 'user@example.com',
    password: 'password'
})

Liveme.getUserInfo('123456790123456')
    .then(user => {
        // user.user_info contains details on the user queried
    })
    .catch(err => {
        // Unable to locate user account
    })
```