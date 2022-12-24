const app = require('express');
const router = app.Router();
const passport = require('passport');
const User= require('../models/user')

router.get('/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  async function (req, res) {
    const check = await User.findOne({
      steamid: req.user.steamid,
    })
    if(check){
      res.redirect('/');
    }
    else{
      res.redirect('/user/regist')
    }
  }
   );

router.get('/steam/return',
  // Issue #37 - Workaround for Express router module stripping the full url, causing assertion to fail 
  function (req, res, next) {
    req.url = req.originalUrl;
    next();
  },
  passport.authenticate('steam', { failureRedirect: '/' }),
  async function (req, res) {
    const check = await User.findOne({
      steamid: req.user._json.steamid,
    })
    
    if(check){
      res.redirect('/');
    }
    else{
      res.redirect('/user/regist')
    }
  });

module.exports = router;