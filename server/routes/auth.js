const express = require('express')
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { getUser } = require('../controllers/userController');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value,
        };
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (error) {
            console.log(error);
        }
    }
));

/*
 * GET /
 * home page.
 */
router.route('/user').get(getUser)
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/dashboard'
    }));

// Route if something goes wrong
router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...');
});

// Destroy user session
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send('Error loggin out');
        } else {
            res.redirect('/')
        }
    })
});

// Presist user data after successful authentication
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Retrieve user data from session.
// Original Code
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// New
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = router;