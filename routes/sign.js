const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../checkUser.js');
const User = require('../schema/user');

router.get('/', isNotLoggedIn, async(req, res, next) => {
  res.render('sign');
});

router.post('/', isNotLoggedIn, async(req, res, next) => {
  const {loginId, password} = req.body;
  try{
    const exUser = await User.findOne({"loginId": req.body.loginId});
    if(exUser){
      return res.send(`<script> alert('이미 가입된 학번입니다');window.location = "/sign";</script>`);
      //return res.redirect('/login/sign');
    }
    await User.create({
      loginId,
      password
    });
    return res.redirect('/login');
  }catch(err){
    console.error('여기에러에용1');
    next(err);
  }
});

module.exports = router;
