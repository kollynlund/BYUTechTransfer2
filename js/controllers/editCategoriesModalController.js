(function(app) {

function EditCategoriesModalController($modalInstance) {
	this.close = function () {
		$modalInstance.close();
	};
}

app
.controller('EditCategoriesModalController', EditCategoriesModalController);
})(angular.module('techtransfer'));