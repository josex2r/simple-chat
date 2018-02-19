const express = require('express');
const router = express.Router();

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
