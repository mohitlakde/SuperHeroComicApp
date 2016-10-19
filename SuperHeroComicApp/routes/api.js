var config = require('../config');
var superagent = require('superagent');
var async = require('async');

module.exports = function (app) {
  
  app.get('/results/search', function(req, res) {
    superagent
      .get(config.api.base + '/characters')
      .query({api_key: config.api.key})
      .query({filter:"name:" + req.query.name})
      .query({format : "json"})
      .end(function(err, result) {

        //assuming first one is correct
    	 res.json(result.body.results);
    	  //console.log(JSON.parse(result.text).results);
      });
    
  });
  
  app.get('/results/details', function(req, res) {

	    superagent
	      .get(config.api.base + '/character/' + req.query.id+"/" )
	      .query({api_key: config.api.key})
	      .query({format : "json"})
	      .query({field_list:"name,origin,publisher,character_enemies,character_friends,deck,image,powers,id,teams,api_detail_url"})
	      .end(function(err, result) {
	        if (err || result.statusCode !== 200) {
	          res.send(err);
	        }
	        else {
	          //console.log(JSON.parse(result.text).results);
	          res.json(result.body.results);
	        }
	      });
	  }); 
  app.get('/results/powers', function(req, res) {
	    superagent
	      .get(config.api.base + '/character/' + req.query.id + '/powers.json')
	      .query({apikey: config.api.key})
	      .query({format:"json"})
	      .end(function(err, result) {
	        if (err || result.statusCode !== 200) {
	          res.send(err);
	        }
	        else {
	          //console.log(JSON.parse(result.text));
	          res.json(result.body);
	        }
	      });
	  });
  
  app.get('/results/versus', function(req, res) {
	    async.parallel({
		      mainDetail: function(next){
		        _heroDetails(req.query.main, next);
		      },
		      challengerDetail: function(next){
		        _heroDetails(req.query.challenger, next);
		      }      
	    }, function done(err, results) {
	      if (err) {
	        res.json(err);
	      }
	      else {	    	  
	        res.json(results);
	      }
	    });
	  });
  
 app.get('/results/friends', function(req, res) {
	    superagent
	      .get(config.api.base + '/character/' + req.query.id + '/friends.json')
	      .query({apikey: config.api.key})
	      .query({format:"json"})
	      .end(function(err, result) {
	        if (err || result.statusCode !== 200) {
	          res.send(err);
	        }
	        else {
	          res.json(result.body);
	        }
	      });
	  });
  app.get('/results/enemies', function(req, res) {
	    superagent
	      .get(config.api.base + '/character/' + req.query.id + '/ememies.json')
	      .query({apikey: config.api.key})
	      .query({format:"json"})
	      .end(function(err, result) {
	        if (err || result.statusCode !== 200) {
	          res.send(err);
	        }
	        else {
	          //console.log(JSON.parse(result.text));
	          res.json(result.body);
	        }
	      });
	  });    
};
function _heroDetails(id, callback){	
	superagent
	   .get(config.api.base + '/character/' + id + "/" )
	   .query({api_key: config.api.key})
	   .query({format : "json"})
	   .query({field_list:"name,origin,publisher,character_enemies,character_friends,deck,image,powers,id,teams,api_detail_url"})
	   .end(function(err, result) {
	      callback(err, JSON.parse(result.text));
	   
	 }); 
   }
