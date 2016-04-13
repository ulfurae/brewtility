'use strict';

var http = require('http');
var constants = require('./brewDbConstants');

/* ************************** *\
|| ** Variable Declaration ** ||
\* ************************** */

var _fermentables;
var _hops;
var _yeasts;
var _adjuncts;

/* *********************** *\
|| ** Private Functions ** ||
\* *********************** */

function sendRequest(url, key, endpoint, page, callback) {
	http.get(url + endpoint + key + page, callback);
}

/* ********************** *\
|| ** Public Functions ** ||
\* ********************** */

function getFermentables(callback) {
	if(!_fermentables) {
		sendRequest(constants.url, constants.key, constants.fermentables, constants.page(1), function (res) { // jshint ignore:line
			var data = '';

			res.on('data', function (resData) {
			    data += resData;
			});

			 res.on('end', function() {
			 	_fermentables = JSON.parse(data);
			 	callback(_fermentables);
			});
		});
	} 
	else {
		callback(_fermentables);
	}
}

function getHops(callback) {
	if(!_hops) {
		sendRequest(constants.url, constants.key, constants.hops, constants.page(1), function (res) { // jshint ignore:line
			var data = '';

			res.on('data', function (resData) {
			    data += resData;
			});

			 res.on('end', function() {
			 	_hops = JSON.parse(data);
			 	callback(_hops);
			});
		});
	} 
	else {
		callback(_hops);
	}
}

function getYeasts(callback) {
	if(!_yeasts) {
		sendRequest(constants.url, constants.key, constants.yeasts, constants.page(1), function (res) { // jshint ignore:line
			var data = '';

			res.on('data', function (resData) {
			    data += resData;
			});

			 res.on('end', function() {
			 	_yeasts = JSON.parse(data);
			 	console.log(_yeasts);
			 	callback(_yeasts);
			});
		});
	} 
	else {
		callback(_yeasts);
	}
}

function getAdjuncts(callback) {
	if(!_adjuncts) {
		sendRequest(constants.url, constants.key, constants.adjuncts, constants.page(1), function (res) { // jshint ignore:line
			var data = '';

			res.on('data', function (resData) {
			    data += resData;
			});

			 res.on('end', function() {
			 	_adjuncts = JSON.parse(data);
			 	console.log(_adjuncts);
			 	callback(_adjuncts);
			});
		});
	} 
	else {
		callback(_adjuncts);
	}
}

module.exports = {
	getFermentables : getFermentables,
	getHops : getHops,
	getYeasts : getYeasts,
	getAdjuncts : getAdjuncts
};