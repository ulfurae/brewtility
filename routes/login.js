'use strict';

var express = require('express');
var router = express.Router();
var xss = require('node-xss').clean;
var hash = require('password-hash');
var dbUtils = require('../dbUtil/db-utils');

router.post('/login', function(req, res) {

	console.log('bleble');
  var queryStr = 'SELECT * FROM bmusers WHERE username = $1';
  var parameters = [xss(req.body.username)];

  dbUtils.queryDb(queryStr, parameters, function(err,result) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var user =  result.rows[0];
		var passwordMatch = hash.verify(xss(req.loginform.password), user.password);

    if (user && passwordMatch) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function() {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
				res.redirect('/');
      });
    } else {
      res.render('index', { title: 'Brewtility', alert: 'username or password incorrect' }); // jshint ignore:line
    }
  });



});


module.exports = router;
