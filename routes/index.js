const express  = require('express');
const router   = express.Router();
const passport = require('passport');
const User     = require('../models/User');

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// Root route
router.get("/", (req, res) => {
    res.render('landing');
});

// Show register Form
router.get('/register', (req, res) => {
    res.render('register');
});
// Handle sign-up logic
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('register',  {'error': err.message});
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to the Art of Food ${user.username}`)
            res.redirect('/restaurants');
        });
    });
});

// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login logic
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/restaurants',
        failureRedirect: '/login'
    }), (req, res) => {

});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out!');
    res.redirect('/restaurants');
});

module.exports = router;