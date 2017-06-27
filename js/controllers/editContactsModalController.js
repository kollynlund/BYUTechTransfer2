(function(app) {

function EditContactsModalController($modalInstance) {
	this.close = function () {
		$modalInstance.close();
	};
}

app
.controller('EditContactsModalController', EditContactsModalController);
})(angular.module('techtransfer'));