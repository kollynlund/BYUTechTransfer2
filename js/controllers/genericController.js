(function(app) {

function setupRoutes($stateProvider) {
	$stateProvider
    .state('about', {
			url: '/about',
			templateUrl: 'templates/about.html',
			controller: 'GenericController as ac'
		})
		.state('resources', {
			url: '/resources',
			templateUrl: 'templates/resources.html',
			controller: 'GenericController as rc'
		})
		// .state('reset', {
		// 	url: '/reset',
		// 	templateUrl: 'templates/reset.html',
		// 	controller: 'GenericController as rc'
		// });
}

function GenericController($state) {
	var gc = this;
	gc.currentYear = new Date().getFullYear();
	gc.goTo = function(pagename) {
		$state.go(pagename);
	};

	gc.logout = function() {
		localStorage.removeItem('byuttosession')
		gc.goTo("login")
	}

	gc.isLoggedIn = function() {
		if(localStorage.byuttosession)
			return true
		return false
	}
}

app
.config(setupRoutes)
.controller('GenericController', GenericController);
})(angular.module('techtransfer'));
