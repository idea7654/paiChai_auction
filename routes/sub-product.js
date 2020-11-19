const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../checkUser');
const Product = require('../schema/product');
const multer = require('multer');
const upload = multer({dest: './public/images/'});

router.get('/', isLoggedIn, (req, res) => {
  res.render('product_new', {user: req.user});
})

router.get('/update/:id', isLoggedIn, (req, res) => {
  res.render('update', {user: req.params.id});
});

router.post('/', isLoggedIn, upload.single('image'), async(req, res, next) => {
  try{
    //물품등록
    if(req.body.category === '카테고리'){
      await res.send(`<script> alert('카테고리를 골라주세요');window.location = "/sub-product";</script>`)
    }else{
      const result = await Product.create({
        category: req.body.category,
        title: req.body.title,
        owner: req.user.loginId,
        nowprice: req.body.nowprice,
        onceprice: req.body.onceprice,
        image: req.file.filename,
        nowowner: req.user.loginId
      });
      res.redirect('/');
    }
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;
