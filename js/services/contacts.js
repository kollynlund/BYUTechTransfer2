(function(app){

function Contacts($http, $sce, $sessionStorage, _) {
	var techData = $sessionStorage.techData || {
		'technologies': null,
		'categories': null
	};

	var getContacts = function() {
		return $http.get('http://tech-transfer.byu.edu/api/getContacts.php')
		.then(function(result){return result.data;});
	};

	var updateContacts = function(contacts) {
		return $http.post('http://tech-transfer.byu.edu/api/updateContacts.php', { Contacts: contacts })
		.then(function(result){return result.data;});
	};

	return {
		'getContacts': getContacts,
		'updateContacts': updateContacts,
	};
}

app
.factory('Contacts', Contacts);
})(angular.module('techtransfer'));