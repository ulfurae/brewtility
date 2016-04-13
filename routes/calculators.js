'use strict';

var express = require('express');
var router = express.Router();

var title = 'Brewtility';

router.get('/ABV', function(req, res) { 
	res.render('ABVCalculator', { title: title + ' - Alchohol Calculation',session : req.session }); // jshint ignore:line
});

router.get('/priming', function(req, res) {
	res.render('primingCalculator', { title: title + ' - Priming Sugar',session : req.session }); // jshint ignore:line
});

router.get('/hydrometerAdjust', function(req, res) { 
	res.render('HydrometerAdjustments', { title: title + ' - Gravity Adjustments',session : req.session }); // jshint ignore:line
});

module.exports = router;
