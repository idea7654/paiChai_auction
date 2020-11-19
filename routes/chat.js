const express = require('express');
const router = express.Router();
const Room = require('../schema/room');
const Chat = require('../schema/chat');
const {isLoggedIn, isNotLoggedIn} = require('../checkUser');

router.get('/', isLoggedIn, async(req, res, next) => {
  try{
    const result = await Room.find({
      $or: [
        {owner: req.user.loginId},
        {nowowner: req.user.loginId}
      ]
    }).sort('-id');
    res.render('chatList', {user: req.user, result: result});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/:id', isLoggedIn, async(req, res, next) => {
  try{
    const result = await Chat.find({
      roomId: req.params.id
    }).sort('createdAt');
    res.render('chat', {user: req.user, result: result, roomId: req.params.id});
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;
