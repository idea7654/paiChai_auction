const express = require('express');
const router = express.Router();
const Announce = require('../schema/announce');

router.get('/', async(req, res, next) => {
  try{
    const result = await Announce.find({}).sort('-id').exec();
    console.log(result);
    res.render('announceList', {user: req.user, result: result});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/:id', async(req, res, next) => {
  try{
    const result = await Announce.find({
      id: req.params.id
    });
    res.render('announce', {user: req.user, result: result});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/', async(req, res, next) => {
  try{
    const result = await Announce.create({
      title: req.body.title,
      contents: req.body.contents
    });
    result.save();
    res.redirect('/announce');
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;
