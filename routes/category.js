const express = require('express');
const router = express.Router();
const Product = require('../schema/product');
const qs = require('querystring');

router.get('/', async(req, res, next) => {
  let page = req.query.page;
  if(page === undefined){
    page = 1;
  }
  const limitSize = 8;
  let skipSize = (page - 1)*8;
  let pageNum = 1;
  const decodeUrl = qs.unescape(req.query.category);
  try{
    const total = await Product.find({
      category: decodeUrl
    });
    console.log(total);
    pageNum = await Math.ceil(total.length / limitSize);
    const result = await Product.find({
      category: decodeUrl
    }).sort('-id').skip(skipSize).limit(limitSize);
    res.render('category', {user: req.user, result: result, pagination: pageNum});
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;
