'use strict';

module.exports = {
	url: 'http://api.brewerydb.com/v2',
	key: '?key=87d3edaaf389879c1731b0ebdc641e3e',
	//Endpoints
	fermentables: '/fermentables/',
	hops: '/hops/',
	yeasts: '/yeasts/',
	adjuncts: '/adjuncts/',
	//Paga parameter
	page: createPageCode
};

function createPageCode(pageNumber) {
	console.log(pageNumber);
	return '&p=' + pageNumber.toString();
}