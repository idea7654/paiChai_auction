const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../checkUser.js');
const User = require('../schema/user');

router.get('/', isNotLoggedIn, (req, res) => {
  res.render('login', {user: req.user});
});

router.post('/', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if(authError){
      console.error(authError);
      return next(authError);
    }
    if(!user){
      return res.send(`<script> alert('가입되지 않은 학생입니다.');window.location = "/login";</script>`);
      //return res.redirect('/login');
    }
    return req.login(user, () => {
      return res.redirect('/');
    });
  })(req, res, next);
});



router.get('/logout', isLoggedIn, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
