const express = require('express');
const router = express.Router();
const Product = require('../schema/product');
const Finishproduct = require('../schema/finishproduct');
const Room = require('../schema/room');
const Announce = require('../schema/announce');
const {isLoggedIn, isNotLoggedIn} = require('../checkUser.js');
const moment = require('moment');

/* GET home page. */
router.get('/', async(req, res, next) => {
  try{
    if(Object.keys(req.query).length == 0){
      const result = await Product.find({}).sort('-id').limit(8);
      const announceResult = await Announce.find({}).sort('-id').limit(5);
      for(let i in result){
        let setTime = moment(result[i].finaltime).format('DD-MM-YYYY HH:mm');
        let currentdate = new Date();
        let setTime1 = setTime.split(' ')[1].split(':');
        let setTime2 = setTime.split(' ')[0].split('-');
        let newDate = new Date(setTime2[2], setTime2[1]-1, setTime2[0], setTime1[0], setTime1[1]);
        let elapsedTime = newDate.getTime() - currentdate.getTime();
        if(elapsedTime < 0){
          const subResult = await Finishproduct.create({
            category: result[i].category,
            title: result[i].title,
            owner: result[i].owner,
            nowowner: result[i].nowowner,
            finalprice: result[i].nowprice,
            image: result[i].image,
            pay: false
          });
          const deleteResult = await Product.deleteOne({
            id: result[i].id
          });
          const newChat = await Room.create({
            id: result[i].id,
            owner: result[i].owner,
            nowowner: result[i].nowowner,
            title: result[i].title,
            finalprice: result[i].nowprice
          });
        }
      }
      res.render('index', {user: req.user, result: result, announceResult: announceResult});
    }
    else{
      const searchResult = await Product.find({
        title: {'$regex': req.query.search}//{$in: req.query.search}
      }).sort('-id').exec((err, docs) => {
        res.render('search', {user: req.user, result: docs});
      });
    }
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/nowbid', isLoggedIn, async(req, res, next) => {
  let page = req.query.page;
  if(page === undefined){
    page = 1;
  }
  const limitSize = 8;
  let skipSize = (page - 1)*8;
  let pageNum = 1;
  try{
    const total = await Product.find({
      nowowner: req.user.loginId
    });
    pageNum = await Math.ceil(total.length / limitSize);
    const result = await Product.find({
      nowowner: req.user.loginId
    }).sort('-id').skip(skipSize).limit(limitSize);
    res.render('nowbid', {user: req.user, result: result, pagination: pageNum});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/finishbid', isLoggedIn, async(req, res, next) => {
  let page = req.query.page;
  if(page === undefined){
    page = 1;
  }
  const limitSize = 8;
  let skipSize = (page - 1)*8;
  let pageNum = 1;
  try{
    const total = await Finishproduct.find({
      nowowner: req.user.loginId
    });
    pageNum = await Math.ceil(total.length / limitSize);
    const result = await Finishproduct.find({
      nowowner: req.user.loginId
    }).sort('-id').skip(skipSize).limit(limitSize);
    res.render('success-bid', {user: req.user, result: result, pagination: pageNum});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/finishbid/:id', isLoggedIn, async(req, res, next) => {
  let flag = false;
  try{
    const result = await Finishproduct.findOne({
      id: req.params.id
    });
    if(parseInt(result.nowowner) === req.user.loginId){
      flag = await true;
    }
    console.log(result);
    res.render('finishproduct', {user: req.user, result: result, flag: flag});
  }catch(err){
    console.error(err);
    next(err);
  }
})

router.get('/nowsell', isLoggedIn, async(req, res, next) => {
  let page = req.query.page;
  if(page === undefined){
    page = 1;
  }
  const limitSize = 8;
  let skipSize = (page - 1)*8;
  let pageNum = 1;
  try{
    const total = await Product.find({
      owner: req.user.loginId
    });
    pageNum = await Math.ceil(total.length / limitSize);
    const result = await Product.find({
      owner: req.user.loginId
    }).sort('-id').skip(skipSize).limit(limitSize);
    res.render('exhibit', {user: req.user, result: result, pagination: pageNum});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/finishsell', isLoggedIn, async(req, res, next) => {
  let page = req.query.page;
  if(page === undefined){
    page = 1;
  }
  const limitSize = 8;
  let skipSize = (page - 1)*8;
  let pageNum = 1;
  try{
    const total = await Finishproduct.find({
      owner: req.user.loginId
    });
    pageNum = await Math.ceil(total.length / limitSize);
    const result = await Finishproduct.find({
      owner: req.user.loginId
    }).sort('-id').skip(skipSize).limit(limitSize);
    res.render('complete-sales', {user: req.user, result: result, pagination: pageNum});
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;
