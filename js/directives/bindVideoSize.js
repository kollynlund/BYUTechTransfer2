(function(app) {

function bindVideoSize($window, $timeout, VideoSize) {
	return {
		restrict: 'A',
		replace: false,
		link: function(scope, element) {
			function bindSize() {
				scope.$apply(function() {
					VideoSize.dimensions.width = element[0].clientWidth;
					VideoSize.dimensions.height = element[0].clientHeight;
				});
			};
			$window.onresize = bindSize;
			// Allow current digest loop to finish before setting VideoSize
			$timeout(bindSize, 0);
		}
	};
}

app
.directive('bindVideoSize', bindVideoSize);
})(angular.module('techtransfer'));