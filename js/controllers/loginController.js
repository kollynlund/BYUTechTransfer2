(function(app) {

function setupRoute($stateProvider) {
	$stateProvider
    .state('login', {
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginController as lc'
		})
		.state('reset', {
			url: '/reset',
			templateUrl: 'templates/reset.html',
			controller: 'LoginController as lc'
		});
}


function LoginController(Auth, $state, $location) {
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

	lc.sendReset = function() {
		Auth.Reset()
		.then(function() {
			lc.password_reset_clicked = true;
		})

		// $.ajax({
    //   url: "resetPassword.php",
    //   type: 'post',
    //   success: function(){alert("Password reset email sent");}
    // });
	}

	lc.reset = function() {
		if(!lc.password || lc.password.length < 8) {
			lc.error = "Password must be at least 8 characters long."
		}
		else if(lc.password != lc.passwordConfirmation) {
			lc.error = "Passwords do not match.";
		}
		else {
	  	lc.token = $location.search().reset_token;
			Auth.ChangePassword(lc.token, lc.password)
			.then(function() {
				$state.go('login')
			})
		}
	}
}

app
.config(setupRoute)
.controller('LoginController', LoginController);
})(angular.module('techtransfer'));
