(function(app){

function Emailer($http) {
	return {
		SendContactEmail: function(the_data) {
			return $http({
				method: 'POST',
				url: 'utils/send_email.php',
				headers: {
					'Content-Type':'application/json'
				},
				data: the_data
			});
		}
	}
}

app
.factory('Emailer', Emailer);
})(angular.module('techtransfer'));