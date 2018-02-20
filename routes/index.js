var express = require('express');
const login = require('./login');
const chat = require('./chat');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user) {
        res.redirect('/chat');
    } else {
        res.render('index', {
            title: 'Simple Chat',
            error: req.query.error,
            logout: !!req.query.logout
        });
    }
});

router.use(login, chat);

module.exports = router;
