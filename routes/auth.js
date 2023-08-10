const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy
const AzureStrategy = require('passport-azure-ad-oauth2').Strategy;
const jwt_decode = require('jwt-decode');

var router = express.Router();

/**********************  Strategies ***********************/
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/oauth2/redirect/google',
  scope: [ 'profile', 'email',  ]
}, async function verify(accessToken, refreshToken, profile, cb) {
  console.log(profile) // Print all data to the console
  return cb(null, profile) // this will call serializeUser
}));

passport.use(new AzureStrategy({
  clientID: process.env.AZURE_AD_CLIENT_ID,
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
  callbackURL: '/api/auth/signin/azure-ad', // This link is the redirect uri, you can set or get one in Azure under authentication
  scope: [ 'profile']
}, async function verify(accessToken, refresh_token, params, profile, cb) {
  var waadProfile = jwt_decode(params.id_token);
  console.log(waadProfile) // Print all data to the console

  // You can assign more data if you want to
  return cb(null, { displayName: waadProfile.name, email: waadProfile.upn }) // this will call serializeUser
}));

/************************************************************ */

/** This function saves the session in the ram or db, depending which one you choose */
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    //console.log(user)
    cb(null, { ...user })
  });
});

/** When an user makes a request, this function is going to execute. It gets the session from ram or db */
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

// Setup the google routes
router.get('/login/federated/google', passport.authenticate('google'));

// This is part of the redirect uri, very important
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: 'http://localhost:3000/success',
  failureRedirect: 'http://localhost:3000'
}));

// Setup the github routes
router.get('/login/azure-ad', passport.authenticate('azure_ad_oauth2'));

// This is part of the redirect uri, very important
router.get('/signin/azure-ad', passport.authenticate('azure_ad_oauth2', { 
    successRedirect: 'http://localhost:3000/success',
    failureRedirect: 'http://localhost:3000'
}));

// API TEST
router.get('/get-user', function(req, res) {
  //console.log(req.user)

  res.json({ ok: true, user: req.user })
})

// Logout
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('http://localhost:3000');
  });
});

module.exports = router;