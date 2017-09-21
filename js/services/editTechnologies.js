(function(app){

function EditTechnologies($http, $sce, $sessionStorage, _, $q) {
	var addTechnology = function(techObject) {
		// return $q.reject(false);
		return $http.post('http://tech-transfer.byu.edu/api/newTech.php', techObject)
		.then(function(result){return result.data;})
		.then(function(result) {
			console.log('my measles eat dogs.', result);
		});
	};

	var editTechnology = function(techObject) {
		console.log('techObject', techObject);
		return $http.post('http://tech-transfer.byu.edu/api/updateTech.php', techObject)
		.then(function(result){return result.data;})
		.then(function(result) {
			console.log('my measles eat dogsnot.', result);
		});
	};

	var deleteTechnology = function(id) {
		return $http.post('http://tech-transfer.byu.edu/api/deleteTech.php', {id:id})
		.then(function(result) {return result.data;})
	}

	return {
		'addTechnology': addTechnology,
		'editTechnology': editTechnology,
		'deleteTechnology': deleteTechnology
	};
}

app
.factory('EditTechnologies', EditTechnologies);
})(angular.module('techtransfer'));
