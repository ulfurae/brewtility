'use strict';
var pg = require('pg');
var conString = 'postgres://postgres:123@localhost/postgres';

exports.queryDb = function(queryStr, parameters, then) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(queryStr, parameters, function(err, result) {
      done();
      if(err) {
        return then(err, null);
      }
      then(null, result);
    });
  });
};

exports.getRecipes = function (userId, cb) {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      return cb(err);
    }
    var values = [userId];
    var query = 'SELECT recipeid, recipe_name, beer_style FROM bm_recipes WHERE userid = $1'; // jshint ignore:line
    client.query(query, values, function (err, result) {
      done();
      if (err) {
        cb(err);
      }
      else {
        cb(null, result.rows);
      }
    });
  });
};

exports.getRecipeInfo = function (userId, recipeId, cb) {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      return cb(err);
    }

    var recipe = {};

    var values = [userId, recipeId];
    var query = 'SELECT * FROM bm_recipes WHERE userid = $1 AND recipeid = $2';
    client.query(query, values, function (err, result) {
      if (err) {
        cb(err);
      }
      else {
        recipe.recipeInfo = result.rows[0];
        console.log(recipe);
      }
    });

    values = [recipeId];
    query = 'SELECT * from bm_recipe_fermentables WHERE recipeid = $1';
    client.query(query, values, function (err, result) {
      if (err) {
        console.log(err);
        cb(err);
      }
      else {
        recipe.fermentables = result.rows;
        console.log(recipe);
      }
    });

    query = 'SELECT * from bm_recipe_hops WHERE recipeid = $1';
    client.query(query, values, function (err, result) {
      if (err) {
        console.log(err);
        cb(err);
      }
      else {
        recipe.hops = result.rows;
        console.log(recipe);
      }
    });

    query = 'SELECT * from bm_recipe_yeast WHERE recipeid = $1';  
    client.query(query, values, function (err, result) {
      if (err) {
        console.log(err);
        cb(err);
      }
      else {
        recipe.yeast = result.rows[0];
        done();
        cb(null, recipe);
      }
    });  
  });
};


exports.saveRecipe = function (recipe, cb) {
  var errorEncountered = false;
  var rollback = function(client, err) {
    if (!errorEncountered) {
        cb(err, null);
        client.query('ROLLBACK', function() {
        client.end();
      });
    }
    errorEncountered = true;
  };

  pg.connect(conString, function (err, client, done) {
    if(err) {
      return cb(err, null);
    }

    client.query('BEGIN', function (err) {
      if (err) {
        return rollback(client, err);
      }

      var recipeId;

      saveRecipeInfo(client, recipe.user.userid, recipe.recipeInfo, function (err, result) { // jshint ignore:line
        if (err) {
          return rollback(client, err);
        }

        recipeId = result.rows[0].recipeid;

        recipe.fermentables.forEach(function (element) {
          saveFermentable(client, recipeId, element, rollback);
        });

        recipe.hops.forEach(function (element) {
          saveHop(client, recipeId, element, rollback);
        });

        saveYeast(client, recipeId, recipe.yeast, rollback);

        if (!errorEncountered) {
          client.query('COMMIT', done());
          cb(null, true);
        }
      });
    });
  });
};

function saveRecipeInfo (client,  userId, recipeInfo, callback) {
  var values = [userId, recipeInfo.notes, recipeInfo.recipeName, recipeInfo.beerStyle]; // jshint ignore:line
  var query = 'INSERT into bm_recipes (userid, notes, recipe_name, beer_style) VALUES($1, $2, $3, $4) RETURNING recipeid'; // jshint ignore:line

  client.query(query, values, function (err, result) {
    if (err) {
      callback(err, null);
    }
    else {
      callback(null, result);
    }
  });
}

function saveFermentable (client, recipeId, fermentable, rollback) {
  var values = [recipeId, fermentable.fermentableName, fermentable.amount];
  var query = 'INSERT INTO bm_recipe_fermentables (recipeid, fermentable_name, amount) VALUES ($1, $2, $3)'; // jshint ignore:line

  client.query(query, values, function (err) {
    if(err) {
      return rollback(client, err);
    } 
  });
}

function saveHop (client, recipeId, hop, rollback) {
  var values = [recipeId, hop.hopName, hop.amount, hop.time, hop.additionType];
  var query = 'INSERT INTO bm_recipe_hops (recipeid, hop_name, amount, time_in_wort, addition_type) VALUES ($1, $2, $3, $4, $5)'; // jshint ignore:line

  client.query(query, values, function (err) {
    if(err) {
      return rollback(client, err);
    } 
  });
}

function saveYeast (client, recipeId, yeast, rollback) {
  var values = [recipeId, yeast.brandName, yeast.yeastVariety, yeast.otherInfo];
  var query = 'INSERT INTO bm_recipe_yeast (recipeid, brand_name, yeast_variety, other_info) VALUES ($1, $2, $3, $4)'; // jshint ignore:line

  client.query(query, values, function (err) {
    if(err) {
      return rollback(client, err);
    }
  });
}
