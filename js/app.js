var mainModule = angular.module('techtransfer',['ui.router','ui.bootstrap','ngAnimate','ngStorage']);

(function(app) {
	function DefaultRoute($urlRouterProvider) { $urlRouterProvider.otherwise('/login'); }

	function WhitelistVideoSources($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
	    'self',
	    'https://www.youtube.com/**',
	    'http://www.youtube.com/**',
	    'https://www.vimeo.com/**',
	    'http://www.vimeo.com/**'
	  ]);
	}

	function scrollFix($rootScope, $document, $state) {
		$rootScope.$on('$stateChangeSuccess', function() {
			$document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
		});
	}
	

	// APP BOOTSTRAPPING
	app
	.config(DefaultRoute)
	.config(WhitelistVideoSources)
	.run(scrollFix)
	// .filter('offset', offset)
	// .factory('Auth', Auth)
	// .factory('Emailer', Emailer)
	// .factory('TechnologyDetails', TechnologyDetails)
	// .factory('VideoSize',VideoSize)
	// .factory('YouTubeSize',YouTubeSize)
	// .factory('PageTitle', PageTitle)
	.factory('_',function() {
		return _;
	});
})(mainModule);