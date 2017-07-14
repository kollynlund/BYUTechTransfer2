(function(app){

function Categories($http, $sce, $sessionStorage, _) {
	var techData = $sessionStorage.techData || {
		'technologies': null,
		'categories': null
	};

	var getCategories = function() {
		return $http.get('http://tech-transfer.byu.edu/api/getCategories.php')
		.then(function(result){return result.data.map(category => category.name);});
	};

	var updateCategories = function(categoriesArray) {
		return $http.post('http://tech-transfer.byu.edu/api/updateCategories.php', { Categories: categoriesArray })
		.then(function(result){return result.data;});
	};

	return {
		'getCategories': getCategories,
		'updateCategories': updateCategories,
	};
}

app
.factory('Categories', Categories);
})(angular.module('techtransfer'));