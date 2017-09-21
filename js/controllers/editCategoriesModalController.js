(function(app) {

function EditCategoriesModalController($modalInstance, Categories, $scope) {
	var ecmc = this;

	Categories.getCategories()
		.then(function(categories) { categories.sort(); ecmc.categories = categories; });

	ecmc.deleteCategoryEntry = function(categoryEntryIndex) { ecmc.categories.splice(categoryEntryIndex, 1); };

	ecmc.addCategoryEntry = function() { ecmc.categories.push(''); };

	ecmc.save = function() {
		Categories.updateCategories(ecmc.categories)
		.then(function() {
			$scope.$apply();
			ecmc.close();
		});
	};

	ecmc.close = function () { $modalInstance.close(); };
}

app
.controller('EditCategoriesModalController', EditCategoriesModalController);
})(angular.module('techtransfer'));
