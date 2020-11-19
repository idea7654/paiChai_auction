const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../checkUser');

router.get('/', isLoggedIn, (req, res) => {
  res.render('sub-announce', {user: req.user});
});

module.exports = router;
