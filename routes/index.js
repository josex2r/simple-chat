var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.user) {
        res.redirect('/chat');
    } else {
        res.render('index', {
            title: 'Simple Chat',
            error: !!req.query.error,
            logout: !!req.query.logout
        });
    }
});

// Add auth middleware
router.post('/login', (req, res) => {
    const { name, remember } = req.body;
    
    // Set 1h to expire
    if (remember) {
        req.sessionOptions.maxAge = 24 * 60 * 60 * 1000 // 24 hours
    }
    
    if (true) {
        req.session.user = name;
        res.redirect('/chat');
    } else {
        res.redirect('/?error=true');
    }
});
 
// Logout endpoint
router.get('/logout', (req, res) => {
    req.session = null
    res.redirect('/?logout=true');
});


module.exports = router;
