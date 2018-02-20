const express = require('express');
const { URL } = require('url');
const auth = require('../lib/middlewares/auth');
const users = require('../lib/users');

const router = express.Router();

router.use(auth);

router.get('/chat', (req, res) => {
    // Check if username is connected and exists
    const user = users[req.session.user];
    
    if (user) {
        req.session = null;
        res.redirect('/?error=' + encodeURIComponent('El nombre de usuario ya está en uso'));
    } else {
        res.render('chat', {
            user: req.session.user,
            date: new Date()
        });
    }
});

module.exports = router;
