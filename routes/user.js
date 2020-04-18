var express = require('express');
var router = express.Router();
var User = require('../model/user')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},


    function (email, password, done) {

        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err) }


            let newUser = new User
            newUser.email = email
            newUser.password = newUser.passwordHash(password)

            newUser.save(function (err, user) {
                if (err) { return done(err) }
                return done(null, user)
            })
        })

    }))

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err) }

            if (!user || !user.passwordVerify(password)) {
                return done(null, false, { message: 'User not found' });
            }

            return done(null, user)

        })
    }))
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

/* GET home page. */
router.get('/register', guest, function (req, res, next) {
    res.render('user/register');
});

router.post('/register', passport.authenticate('local.register', {
    successRedirect: '/user/account',
    failureRedirect: '/user/register',
}))

router.get('/login', guest, function (req, res, next) {
    res.render('user/login');
});

router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/user/account',
    failureRedirect: '/user/login',
}))

router.get('/account', auth, function (req, res, next) {
    res.render('user/account');
});
router.get('/logout', auth, function (req, res, next) {
    req.logout()
    return res.redirect('/')
});
function auth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

function guest(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}



module.exports = router;