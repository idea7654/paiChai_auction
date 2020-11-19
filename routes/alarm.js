const express = require('express');
const router = express.Router();
const Alarm = require('../schema/alarm');
const {isLoggedIn, isNotLoggedIn} = require('../checkUser');

router.get('/', isLoggedIn, async(req, res) => {
  try{
    const result = await Alarm.find({
      owner: req.user.loginId,
    }).sort('-id');
    await Alarm.updateMany({
      owner: req.user.loginId
    }, {
      read: true
    });
    if(result.length === 0){
      res.send(`<script> alert('알림이 없습니다!');window.location = "/";</script>`);
    }else{
      res.render('alarm', {user: req.user, result: result});
    }
  }catch(err){
    res.status(500).send(err);
  }
});

module.exports = router;
