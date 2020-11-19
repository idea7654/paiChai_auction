const express = require('express');
const router = express.Router();
const Product = require('../schema/product');
const Finishproduct = require('../schema/finishproduct');
const Room = require('../schema/room');
const Alarm = require('../schema/alarm');

const {isLoggedIn, isNotLoggedIn} = require('../checkUser.js');
const moment = require('moment');

router.get('/', async(req, res, next) => {
  try{
    //const result = await Product.find();
    res.render('product_new');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/:id', isLoggedIn, async(req, res, next) => {
  let flag = false;
  try{
    const result = await Product.findOne({
      id: req.params.id
    });
    if(result){
      if(result.owner == req.user.loginId){
        flag = await true;
      }
    }
    console.log(result);
    res.render('product', {product: result, user: req.user.loginId, moment, flag: flag});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.delete('/:id', async(req, res, next) => {
  try{
    const result = await Product.deleteOne({
      id: req.params.id
    });
    res.redirect('/');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.put('/:id/bid', isLoggedIn, async(req, res, next) => {
  try{
    const result = await Product.findOne({id: req.params.id}, (err, doc) => {
      if(doc.nowprice > req.body.bidvalue){
        res.send(`<script> alert('더 높은 값을 입력해주세요');window.location = "/product/${req.params.id}";</script>`);
      }else{
        Alarm.create({
          owner: doc.nowowner,
          content: `${doc.title} 상품을 더 높은값에 입찰한 사람이 있습니다!`,
          read: false
        });
        doc.nowprice = req.body.bidvalue;
        doc.nowowner = req.session.passport.user;
        doc.save();
      }
    });
    res.redirect(`/product/${req.params.id}`);
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.put('/:id/finishbid', isLoggedIn, async(req, res, next) => {
  try{
    const result = await Product.findOne({id: req.params.id}, (err, doc) => {
      const subResult = Finishproduct.create({
        category: doc.category,
        title: doc.title,
        owner: doc.owner,
        nowowner: req.session.passport.user,
        finalprice: doc.onceprice,
        image: doc.image,
        pay: false
      });

      const newChat = Room.create({
        id: doc.id,
        owner: doc.owner,
        nowowner: req.session.passport.user,
        title: doc.title,
        finalprice: doc.onceprice
      })
    });
    const deleteResult = await Product.deleteOne({
      id: req.params.id
    });
    res.redirect('/');
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;
