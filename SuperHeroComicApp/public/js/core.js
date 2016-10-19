 var app = angular.module('app', ['ngResource']);

app.factory('resources', function($resource,$location) {
  var factory = {};
  var url = $location.absUrl().split('/');
  var heroID = url[url.length - 2];
  console.log($location.absUrl());
  console.log(heroID);
  
  var Vurl=$location.absUrl().split('/');
  var mainID="4005-"+Vurl[Vurl.length - 3];
  var challengerID="4005-"+Vurl[Vurl.length - 1];
  
  
factory.routes = {
		  superHeroAPI: $resource('/results/:action', {}, {
      fetch: {method: 'GET', params: {name: '@name', action: 'search'}, isArray: true },
      details: {method: 'GET', params: {id: heroID, action: 'details'}, isArray: false },
      powers: {method: 'GET', params: {id: heroID, action: 'powers'}, isArray: false },
      friends: {method: 'GET', params: {id: heroID, action: 'friends'}, isArray: false },
      enemies: {method: 'GET', params: {id: heroID, action: 'Enemies'}, isArray: false },
      versus: {method: 'GET', params: {main: mainID, challenger: challengerID, action: 'versus'}, isArray: false }
     })
  };

  return factory;
});

app.controller('heroController', function($scope, resources) {

$scope.searchSuperHero = function() {
    resources.routes.superHeroAPI.fetch({name: $scope.name}, function done(response) {
      $scope.heroes=response;
      $scope.hero = response[0];		
    });
  };  
  
 $scope.otherheroes=function(otherhero){
	 $scope.hero=otherhero;
 } 
});
app.controller('heroVersusController', function($scope, resources) {
	  function init() {		  
	    resources.routes.superHeroAPI.versus(function done(response) {
	        $scope.hero = response;
	        $scope.main_hero=response.mainDetail;
	        $scope.villian=response.challengerDetail;
	        
	        $scope.main_hero.results.character_friends=response.mainDetail.results.character_friends.slice(0,10);
	        $scope.main_hero.results.character_enemies=response.mainDetail.results.character_enemies.slice(0,10);
	        $scope.main_hero.results.powers=response.mainDetail.results.powers.slice(0,5);
	        $scope.main_hero.results.teams=response.mainDetail.results.teams.slice(0,3);
	        
	        
	        $scope.villian.results.character_friends=response.mainDetail.results.character_friends.slice(0,10);
	        $scope.villian.results.character_enemies=response.mainDetail.results.character_enemies.slice(0,10);
	        $scope.villian.results.powers=response.mainDetail.results.powers.slice(0,5);
	        $scope.villian.results.teams=response.mainDetail.results.teams.slice(0,3);
	        
	        
	        
	        console.log(response);
	    });
	  }
	  init();
	});

app.controller('heroDetailController', function($scope, resources) {
	  function init() {
		 resources.routes.superHeroAPI.details(function done(response) {
			//console.log(response);
			
		    $scope.hero = response;
		    $scope.powers= response.powers;
		    $scope.friends= response.character_friends;
		    $scope.enemies=response.character_enemies;
		    //console.log($scope.friends);
		      });
		  }
	  $scope.togglePowers = function() {
		    if ($scope.displayPowers) {
		      $scope.powersBtnText = 'powers';
		      $scope.displayPowers = false;
		    }
		    else {
		      $scope.powersBtnText = 'hide powers';
		      $scope.displayPowers = true;
		    }
		  };
		  
		  $scope.toggleFriends = function() {
			    if ($scope.displayFriends) {
			      $scope.friendsBtnText = 'Friends';
			      $scope.displayFriends = false;
			    }
			    else {
			      $scope.friendsBtnText = 'hide Friends';
			      $scope.displayFriends = true;
			    }
			  };
			  
		 
			  $scope.toggleEnemies = function() {
				   if ($scope.displayEnemies) {
				      $scope.enemiesBtnText = 'Enemies';
				      $scope.displayEnemies = false;
				    }
				    else {
				      $scope.enemiesBtnText = 'hide Enemies';
				      $scope.displayEnemies = true;
				    }
				  };
	  

			  init();		  
});
