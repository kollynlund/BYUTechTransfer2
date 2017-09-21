(function(app) {

function ConfirmDeleteModalController($modalInstance, techId, EditTechnologies, $state) {
	this.techId = techId;

	this.close = function () {
		$modalInstance.close();
	};

	this.delete = function() {
		EditTechnologies.deleteTechnology(this.techId)
		.then(function() {
			$modalInstance.close();
			$state.go("technologies");
		});
	}
}

app
.controller('ConfirmDeleteModalController', ConfirmDeleteModalController);
})(angular.module('techtransfer'));
