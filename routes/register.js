'use strict';

var express = require('express');
var router = express.Router();
var xss = require('node-xss').clean;
var hash = require('password-hash');
var dbUtils = require('../dbUtil/db-utils');

var title = 'Brewtility - Register';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('register', {title: title});
});

/* GET home page. */
router.post('/', function(req, res) {

  var hPassword = hash.generate(xss(req.body.password));
	console.log(hPassword);
  var parameters = [xss(req.body.fullname), xss(req.body.username), hPassword];

  var queryStr = 'INSERT INTO bmusers (fullname, username, password) VALUES ($1,$2,$3)'; // jshint ignore:line
  dbUtils.queryDb(queryStr, parameters, function(err) {
    if(err) {
      return console.error('error saving new user', err);
    }
    
    res.render('register', {title: title, msg: 'You have created an account! You can now sign in and start brewing.'}); // jshint ignore:line
  });
});


module.exports = router;
