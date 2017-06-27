(function(app) {

function TechnologyPictureModalController($modalInstance) {
	this.close = function () {
		$modalInstance.close();
	};
}

app
.controller('TechnologyPictureModalController', TechnologyPictureModalController);
})(angular.module('techtransfer'));