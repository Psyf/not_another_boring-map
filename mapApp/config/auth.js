// config/auth.js
const sensitiveData = require('./config.js');

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : sensitiveData.fb.key, // your App ID
        'clientSecret'  : sensitiveData.fb.secret, // your App Secret
        'callbackURL'   : 'http://localhost:4000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:4000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : sensitiveData.google.clientID,
        'clientSecret'  : sensitiveData.google.clientSecret,
        'callbackURL'   : 'http://localhost:4000/auth/google/callback'
    }

};
