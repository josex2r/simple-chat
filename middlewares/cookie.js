const cookieSession = require('cookie-session');


module.exports = cookieSession({
  name: 'session',
  keys: ['simple-chat'],
  maxAge: 60 * 60 * 1000 // 1 hour
})
