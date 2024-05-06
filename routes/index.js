let express = require('express');
let session = require('express-session');
let router = express.Router();
let db = require('../database/config');
const isAuth = require('./middleware/isAuth');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express', session :req.session });
});



module.exports = router;
