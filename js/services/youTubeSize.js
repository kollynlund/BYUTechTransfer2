(function(app){

function YouTubeSize($interval) {
	var dimensions = {
		'width': null,
		'height': null
	};

	return {
		'dimensions': dimensions
	};
}

app
.factory('YouTubeSize', YouTubeSize);
})(angular.module('techtransfer'));