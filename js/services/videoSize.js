(function(app){

function VideoSize($interval) {
	var dimensions = {
		'width': null,
		'height': null
	};

	return {
		'dimensions': dimensions
	};
}

app
.factory('VideoSize', VideoSize);
})(angular.module('techtransfer'));