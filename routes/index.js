'use strict';
var express = require('express');
var dbUtils = require('../dbUtil/db-utils');
var router = express.Router();
var xss = require('node-xss').clean;
var hash = require('password-hash');
var loginalert = null;

var title = 'Brewtility';

/* GET home page */
router.get('/', function(req, res) {
  console.log(req.session);
  res.render('index', {title: title, session : req.session, currentUrl:'/'});
});

/* POST login form */
router.post('/login', function(req, res) {

  var queryStr = 'SELECT * FROM bmusers WHERE username = $1';
  var parameters = [xss(req.body.username)];

  dbUtils.queryDb(queryStr, parameters, function(err,result) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var user =  result.rows[0];
		var passwordMatch; 
		if(user) {
      passwordMatch = hash.verify(xss(req.body.password), user.password);
    } 

    if (user && passwordMatch) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function() {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
				loginalert = null;
        req.session.user = user;
				res.redirect('/');
      }); 
    }
		else {
			loginalert = 'username or password incorrect';
			res.render('login', {title: title, alert : loginalert });
		}
  });

});

module.exports = router;
