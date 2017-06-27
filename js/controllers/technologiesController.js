(function(app) {

function setupRoute($stateProvider) {
	$stateProvider
    .state('technologies', {
			url: '/technologies',
			templateUrl: 'templates/technologies.html',
			controller: 'TechnologiesController as tc',
			resolve: {
				technologies: function(TechnologyDetails) {
					return TechnologyDetails.checkForTechnologyLoaded();
				}
			}
		});
}

function TechnologiesController($scope, $state, $filter, technologies, $sessionStorage, Auth) {
	var tc = this;

	Auth.Auth().then(function(isAuthed){$scope.$applyAsync(function(){tc.isAuthed = isAuthed;});});
	tc.freshPage = true;
	tc.techData = technologies;
	tc.relevantTech = tc.techData.technologies.slice(0);
	tc.pages = Math.ceil(tc.techData.technologies.length / 10);
	tc.$storage = $sessionStorage.$default({
		searchText:'',
		categorySearch: {'Categories':' Show All'},
		currentPage: 0
	});
	tc.goToTech = function(tech_id) {
		$state.go('technology',{'tech_id':tech_id});
	};
	tc.goTo = function(pagename) {
		$state.go(pagename);
	};
	tc.editTechnology = function($event, technology) {
		$event.stopPropagation();
		$state.go('editTechnology', {'technology': technology});
	};
	tc.newTechnology = function($event) {
		$event.stopPropagation();
		$state.go('newtechnology', {'new': true});
	};

	function searchWatch(newVals, oldVals) {
		tc.relevantTech = $filter('filter')(tc.techData.technologies, newVals[0]);
		tc.relevantTech = $filter('filter')(tc.relevantTech, (newVals[1] === ' Show All' ? undefined : {'Categories':newVals[1]}));
		tc.pages = Math.ceil(tc.relevantTech.length / 10);
		if (!tc.freshPage) {
			tc.$storage.currentPage = 0;
		}
		else {
			tc.freshPage = false;
		}
	};
	$scope.$watchCollection(function(){return [tc.$storage.searchText, tc.$storage.categorySearch.Categories]}, searchWatch);
}

app
.config(setupRoute)
.controller('TechnologiesController', TechnologiesController);
})(angular.module('techtransfer'));