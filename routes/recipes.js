'use strict';
var express = require('express');
var router = express.Router();
var dbUtils = require('../dbUtil/db-utils');

var title = 'Brewtility';

/* GET Create Recepies. */
router.get('/create', function(req, res) {
  res.render('createRecipe', { title: title + ' - Create Recipe', session : req.session}); // jshint ignore:line
});

router.get('/myRecipes', function(req, res) {
	dbUtils.getRecipes(req.session.user.userid, function (err, result) {
		if (err) {
			res.send(err);
		}
		else {
			res.render('userRecipes', { title: title + ' - Recipes', session : req.session, recipes : result }); // jshint ignore:line
		}
	});

});

router.post('/myRecipes', function(req, res) {
	//var recipeId = parseInt(req.query.recId);
	console.log(req.body);
	var userId = req.session.user.userid;

	dbUtils.getRecipeInfo(userId, req.body.id, function (err, result) {
	 	if (err) {
	 		res.send(err);
	 	}
	 	else {
	 		console.log(result);
			
	 		res.render('viewRecipe', { title: title + ' ' + result.recipeInfo.recipe_name, session : req.session, recipe : result } ); // jshint ignore:line
		
	 	}
	});
});

/* POST recipes listing. */
router.post('/create', function(req, res) {

	var recipe = {};

	recipe.user = req.session.user;

	recipe.recipeInfo = { notes : req.body.beerInfoNotes, 
						  recipeName : req.body.beerInfoRecipeName,
						  beerStyle : req.body.beerInfoBeerStyle };

	recipe.yeast = { brandName : req.body.yeastBrandName,
					 yeastVariety : req.body.yeastVariety,
					 otherInfo : req.body.yeastInfo };

	var fermentables = [];
	if (Array.isArray(req.body.fermentableName)) {
 		req.body.fermentableName.forEach(function(element, index) {
			var fermentable = { fermentableName : req.body.fermentableName[index],
								amount : req.body.fermentableAmount[index] };
			fermentables.push(fermentable);
	   	});
	}
	else {
		var fermentable = { fermentableName : req.body.fermentableName,
							amount : req.body.fermentableAmount };
		fermentables.push(fermentable);
	}
	recipe.fermentables = fermentables;

   	var hops = [];
   	if (Array.isArray(req.body.hopName)) {
	   	req.body.hopName.forEach(function(element, index) {
	   		var hop = { hopName : req.body.hopName[index], 
	   					amount : req.body.hopAmount[index],
	   					time : req.body.hopTime[index], 
	   					additionType : req.body.hopAdditionType[index] };
	   		hops.push(hop);
   		});
   	}
   	else {
   		var hop = { hopName : req.body.hopName, 
	   					amount : req.body.hopAmount,
	   					time : req.body.hopTime, 
	   					additionType : req.body.hopAdditionType };
	   	hops.push(hop);
   	}
   	recipe.hops = hops;
   	
	dbUtils.saveRecipe(recipe, function (err) {
		if (err) {
			res.render('createRecipe', { title: title + ' - Create Recipe',session : req.session, done:'no'}); 
			return console.error('error saving recipe', err);
		}
		else {
  			res.render('createRecipe', { title: title + ' - Create Recipe',session : req.session, done:'yes', name:recipe.recipeInfo.recipeName }); // jshint ignore:line
		}
	});
});

module.exports = router;
