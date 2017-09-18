(function(app) {

function setupRoute($stateProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'templates/home.html',
			controller: 'HomeController as hmc'
		});
}

function HomeController($state, VideoSize) {
	var hmc = this;
	hmc.dimensions = VideoSize.dimensions;
	hmc.goTo = function(pagename) {
		$state.go(pagename);
	};
}

app
.config(setupRoute)
.controller('HomeController', HomeController);
})(angular.module('techtransfer'));
