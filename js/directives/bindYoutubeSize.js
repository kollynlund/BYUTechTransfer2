(function(app) {

function bindYoutubeSize($window, $timeout, YouTubeSize) {
	return {
		restrict: 'A',
		replace: false,
		link: function(scope, element) {
			function bindSize() {
				scope.$apply(function() {
					YouTubeSize.dimensions.width = element[0].clientWidth;
					YouTubeSize.dimensions.height = element[0].clientHeight;
				});
			};
			$window.onresize = bindSize;
			// Allow current digest loop to finish before setting YouTubeSize
			$timeout(bindSize, 0);
		}
	};
}

app
.directive('bindYoutubeSize', bindYoutubeSize);
})(angular.module('techtransfer'));