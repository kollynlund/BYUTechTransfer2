(function(app) {

function ConfirmDeleteModalController($modalInstance) {
	this.close = function () {
		$modalInstance.close();
	};
}

app
.controller('ConfirmDeleteModalController', ConfirmDeleteModalController);
})(angular.module('techtransfer'));
