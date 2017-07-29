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
		lc.loginFailed = false;

		Auth.Auth(lc.username, lc.password)
		.then(function(isAuthed) {
			if (isAuthed) return $state.go('home');
			lc.loginFailed = true;
		})
		.catch(function(error){lc.loginFailed = true;});
	};
}

app
.config(setupRoute)
.controller('LoginController', LoginController);
})(angular.module('techtransfer'));