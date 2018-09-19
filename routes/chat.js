const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    res.render('chat', {
        user: req.session.user,
        date: new Date()
    });
});

module.exports = router;
