const express = require('express');
const router = express.Router();
const Finishproduct = require('../schema/finishproduct');
const {isLoggedIn, isNotLoggedIn} = require('../checkUser.js');

router.get('/', isLoggedIn, async(req, res) => {
  try{
    const sellresult = await Finishproduct.find({
      owner: req.user.loginId
    });

    const buyresult = await Finishproduct.find({
      nowowner: req.user.loginId
    });
    res.render('mypage', {user: req.session.passport.user, sell: sellresult.length, buy: buyresult.length});
  }catch(err){
    res.status(500).send(err);
  }
});

module.exports = router;
