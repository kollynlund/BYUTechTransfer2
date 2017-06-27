(function(app){

function offset() {
	return function(input, start) {
		start = parseInt(start, 10);
		return input.slice(start);
	};
}

app
.filter('offset', offset);
})(angular.module('techtransfer'));