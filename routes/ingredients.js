'use strict';
var express = require('express');
var router = express.Router();
var breweryDb = require('../dbUtil/brewDbUtils');

var title = 'Brewtility - Ingredients | ';
var ingr = '';

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/* GET ingredients page. */
router.get('/fermentables', function(req, res) {

	ingr = 'Fermentables';
	breweryDb.getFermentables(function(data) {
		res.render('ingredients', { title: title + ingr, session : req.session, ingredient : ingr, data: data.data });  // jshint ignore:line
	});
});

router.get('/adjuncts', function(req, res) {

	ingr = 'Adjuncts';
	breweryDb.getAdjuncts(function(data) {
		res.render('ingredients', { title: title + ingr, session : req.session, ingredient : ingr, useNonDescriptionItems : true, data: data.data }); // jshint ignore:line 
	});
});

router.get('/hops', function(req, res) {
	ingr = 'Hops';
	breweryDb.getHops(function(data) {
		res.render('ingredients', { title: title + ingr, session : req.session, ingredient : ingr, data: data.data });  // jshint ignore:line
	});
});

router.get('/yeasts', function(req, res) {
	
	ingr = 'Yeasts';
	breweryDb.getYeasts(function(data) {
		res.render('ingredients', { title: title + ingr, session : req.session, ingredient : ingr, data: data.data });  // jshint ignore:line
	});
});

module.exports = router;
