(function(app){

function Auth($http, $q) {
	return {
		Auth: function(username, password) {
			if (new Date(localStorage.byuttosession) > (new Date(new Date().valueOf() - (1000*60*60*4)))) return $q(function(resolve) {resolve(true);});
			return $http({
				method: 'POST',
				url: 'http://tech-transfer.byu.edu/' + 'api/auth.php',
				data: {
					username: username,
					password: password
				}
			})
			.then(function(response){
				if (response.data.success) localStorage.byuttosession = new Date().toISOString();
				return response.data.success;
			})
			.catch(function(err){return false;});
		}
	};
}

app
.factory('Auth', Auth);
})(angular.module('techtransfer'));