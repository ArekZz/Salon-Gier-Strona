var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.user) {
        if (req.user.admin) {
            res.location('users/admin');
            res.redirect('users/admin');

        } else {
            res.location('users/panel');
            res.redirect('users/panel');

        }


    } else {
        res.render('index', { title: 'Salon-Gier-PC', msg: req.flash('error') });
    }
});

module.exports = router;