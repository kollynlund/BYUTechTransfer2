(function(app) {

function setupRoute($stateProvider) {
	$stateProvider
    .state('login', {
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginController as lc'
		});
}

function LoginController(Auth, $state) {
	var lc = this;
	lc.auth = function() {
		Auth.Auth(lc.username, lc.password)
		.then(function(isAuthed) {
			if (isAuthed) $state.go('home');
		});
	};
}

app
.config(setupRoute)
.controller('LoginController', LoginController);
})(angular.module('techtransfer'));