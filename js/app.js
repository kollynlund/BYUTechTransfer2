window.jsonpCallback = function () { return true; };
String.prototype.toProperCase = function () {
	return this.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

(function(app) {
	// ROUTING
	function Routes($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'templates/home.html',
				controller: 'HomeController as hmc'
			})

			.state('about', {
				url: '/about',
				templateUrl: 'templates/about.html',
				controller: 'GenericController as ac'
			})

			.state('contact', {
				url: '/contact/{tech_id}',
				templateUrl: 'templates/contact.html',
				controller: 'ContactController as cc'
			})

			.state('technologies', {
				url: '/technologies',
				templateUrl: 'templates/technologies.html',
				controller: 'TechnologiesController as tc',
				resolve: {
					technologies: function(TechnologyDetails) {
						return TechnologyDetails.checkForTechnologyLoaded();
					}
				}
			})
				.state('technology', {
					url: '/technology/{tech_id}',
					templateUrl: 'templates/technology.html',
					controller: 'TechnologyController as stc',
					resolve: {
						technologies: function(TechnologyDetails) {
							return TechnologyDetails.checkForTechnologyLoaded();
						},
						technology: function($stateParams, TechnologyDetails) {
							return TechnologyDetails.getSingleTechnology($stateParams.tech_id);
						}
					}
				})

			.state('resources', {
				url: '/resources',
				templateUrl: 'templates/resources.html',
				controller: 'GenericController as rc'
			});
	};

	// CUSTOM DIRECTIVES AND FILTERS
	function fitVids() {
		'use strict';

		if (!document.getElementById('fit-vids-style')) {
			var div = document.createElement('div');
			var ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];
			var cssStyles = '&shy;<style>.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>';
			div.className = 'fit-vids-style';
			div.id = 'fit-vids-style';
			div.style.display = 'none';
			div.innerHTML = cssStyles;
			ref.parentNode.insertBefore(div, ref);
		}

		return {
			restrict: 'A',
			link: function (scope, element, attr) {
				// scope.dimensions = YouTubeSize.dimesions;

				var selectors = [
					"iframe",
					"object",
					"embed"
				];

				var videos;

				if (attr.customSelector) {
					selectors.push(attr.customSelector);
				}

				videos = element[0].querySelectorAll(selectors.join(','));

				angular.forEach(videos, function (item) {

					var $item = angular.element(item);
					var height, width, aspectRatio;

					if (item.tagName.toLowerCase() === 'embed' &&
							($item.parent().tagName === 'object' && $item.parent().length) ||
							$item.parent().hasClass('.fluid-width-video-wrapper')) {
						return;
					}

					height = (item.tagName.toLowerCase() === 'object' || $item.attr('height')) ? parseInt($item.attr('height'), 10) : $item.height();
					width = !isNaN(parseInt($item.attr('width'), 10)) ? parseInt($item.attr('width'), 10) : $item.width();
					aspectRatio = height / width;

					if (!$item.attr('id')) {
						var videoID = 'fitvid' + Math.floor(Math.random()*999999);
						$item.attr('id', videoID);
					}

					$item.wrap('<div class="fluid-width-video-wrapper" bind-youtube-size />').parent().css('padding-top', (aspectRatio * 100) + "%");
					if (attr.blockClick === 'true') {
						$item.parent().append('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"></div>')
					}
					$item.removeAttr('height').removeAttr('width');

				});

			}
		};
	};
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
	};
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
	};
	function offset() {
		return function(input, start) {
			start = parseInt(start, 10);
			return input.slice(start);
		};
	};

	// CONTROLLERS
	function GenericController($state) {
		var gc = this;
		gc.currentYear = new Date().getFullYear();
		gc.goTo = function(pagename) {
			$state.go(pagename);
		};
	}
	function HomeController($state, VideoSize) {
		var hmc = this;
		hmc.dimensions = VideoSize.dimensions;
		hmc.goTo = function(pagename) {
			$state.go(pagename);
		};
	};
	function TechnologiesController($scope, $state, $filter, technologies) {
		var tc = this;
		tc.techData = technologies;
		tc.relevantTech = tc.techData.technologies.slice(0);
		tc.pages = Math.ceil(tc.techData.technologies.length / 10);
		tc.currentPage = 0;
		tc.searchText = '';
		tc.categorySearch = {'Categories':' Show All'};
		tc.goToTech = function(tech_id) {
			$state.go('technology',{'tech_id':tech_id});
		};
		tc.goTo = function(pagename) {
			$state.go(pagename);
		};

		function searchWatch(newVals, oldVals) {
			tc.relevantTech = $filter('filter')(tc.techData.technologies, newVals[0]);
			tc.relevantTech = $filter('filter')(tc.relevantTech, (newVals[1] === ' Show All' ? undefined : {'Categories':newVals[1]}));
			tc.pages = Math.ceil(tc.relevantTech.length / 10);
			tc.currentPage = 0;
		};
		$scope.$watchCollection(function(){return [tc.searchText, tc.categorySearch.Categories]}, searchWatch);
	};
	function TechnologyController($state, $modal, technologies, technology) {
		var stc = this;
		stc.selectedTech = technology;
		stc.openOrIllShootGangsta = function (media) {
			var modalInstance = $modal.open({
					animation: true,
					template: media.type === 'video' ? 
								'<div fit-vids><iframe class="vid" src="'+media.link+'" frameborder="0" allowfullscreen></iframe></div>'
								: '<div><img class="img" src="'+media.link+'"></div>',
					controller: 'TechnologyPictureModalController as tpmc',
					size: 'lg'
			});
		};
		stc.nextTech = nextTech;
		stc.previousTech = previousTech;
		stc.contactAboutTech = function(tech_id) {
			$state.go('contact',{'tech_id':tech_id});
		};
		stc.goTo = function(pagename) {
			$state.go(pagename);
		};

		function nextTech(current_tech_id) {
			// Default to current technology if all else fails
			var new_tech_id = stc.selectedTech.ID;
			if (technologies) {
				var current_index = technologies.technologies.map(function(item){return item.ID}).indexOf(stc.selectedTech.ID);
				new_tech_id = technologies.technologies[(current_index+1 === technologies.technologies.length ? 0 : current_index+1)].ID;
			}
			$state.go('technology',{'tech_id': new_tech_id});
		};
		function previousTech(current_tech_id) {
			// Default to current technology if all else fails
			var new_tech_id = stc.selectedTech.ID;
			if (technologies) {
				var current_index = technologies.technologies.map(function(item){return item.ID}).indexOf(stc.selectedTech.ID);
				new_tech_id = technologies.technologies[(current_index === 0 ? (technologies.technologies.length-1) : current_index-1)].ID;
			}
			$state.go('technology',{'tech_id': new_tech_id});
		};
	};
	function TechnologyPictureModalController($modalInstance) {
		this.close = function () {
			$modalInstance.close();
		};
	};
	function ContactController($scope, $state, $stateParams, Emailer) {
		var cc = this;
		cc.formValid = false;
		cc.emailSent = false;
		cc.formData = {
			name:'',
			patent_id: $stateParams.tech_id,
			email:'',
			message:''
		};

		$scope.$watchCollection(
			function watchFormData() {
				return [cc.formData.name, cc.formData.email, cc.formData.message]
			},
			function handleFormDataChange() {
				if (cc.formData.name && emailRegex.test(cc.formData.email) && cc.formData.message) {
					cc.formValid = true;
				} else {
					cc.formValid = false;
				}
			}
		);

		cc.submitForm = function() {
			if (cc.formValid) {
				Emailer.SendContactEmail(cc.formData);
				cc.emailSent = true;
			}
		};

		cc.goTo = function(pagename) {
			$state.go(pagename);
		};
	};
	function TitleController(PageTitle) {
		var tc = this;
		tc.title = PageTitle.getTitle();
	};

	// SERVICES
	function Emailer($http) {
		return {
			SendContactEmail: function(the_data) {
				return $http({
					method: 'POST',
					url: 'utils/send_email.php',
					headers: {
						'Content-Type':'application/json'
					},
					data: the_data
				});
			}
		}
	};
	function TechnologyDetails($http, $sce, _) {
		var techData = {
			'technologies': null,
			'categories': null
		};

		var parseTechnologyFromGoogleSheets = function(tech_object) {
			return {
				'About the Market': tech_object.gsx$aboutthemarket.$t,
				'Categories': tech_object.gsx$categories.$t.split(','),
				'Contact Email': tech_object.gsx$contactemail.$t,
				'Contact Name': tech_object.gsx$contactname.$t,
				'Contact Phone': tech_object.gsx$contactphone.$t,
				'ID': tech_object.gsx$id.$t,
				'Media': [
					{'link':$sce.trustAsResourceUrl(tech_object['gsx$media1'].$t), 'type':(tech_object['gsx$media1'].$t.indexOf('youtube.com') > -1 ? 'video' : (tech_object['gsx$media1'].$t.indexOf('vimeo.com') > -1 ? 'video' : (tech_object['gsx$media1'].$t ? 'photo' : undefined)))},
					{'link':$sce.trustAsResourceUrl(tech_object['gsx$media2'].$t), 'type':(tech_object['gsx$media2'].$t.indexOf('youtube.com') > -1 ? 'video' : (tech_object['gsx$media2'].$t.indexOf('vimeo.com') > -1 ? 'video' : (tech_object['gsx$media2'].$t ? 'photo' : undefined)))},
					{'link':$sce.trustAsResourceUrl(tech_object['gsx$media3'].$t), 'type':(tech_object['gsx$media3'].$t.indexOf('youtube.com') > -1 ? 'video' : (tech_object['gsx$media3'].$t.indexOf('vimeo.com') > -1 ? 'video' : (tech_object['gsx$media3'].$t ? 'photo' : undefined)))},
					{'link':$sce.trustAsResourceUrl(tech_object['gsx$media4'].$t), 'type':(tech_object['gsx$media4'].$t.indexOf('youtube.com') > -1 ? 'video' : (tech_object['gsx$media4'].$t.indexOf('vimeo.com') > -1 ? 'video' : (tech_object['gsx$media4'].$t ? 'photo' : undefined)))}
				],
				'Links': tech_object.gsx$links.$t.split(',').filter(function(item){return item != ''}),
				'Long Description': tech_object.gsx$longdescription.$t.split('\n\n'),
				'Name': tech_object.gsx$name.$t,
				'PI': tech_object.gsx$pi.$t,
				'Short Description': tech_object.gsx$shortdescription.$t,
				'Tags': tech_object.gsx$tags.$t.split(',')
			};
		};
		var getAllTechnologyData = function() {
			return $http.get('https://spreadsheets.google.com/feeds/list/17Tf9_PvDC-fx3-vTHkmopjAndc94ZTXWFp-q0jxJjrM/1/public/values?alt=json-in-script&callback=jsonpCallback').then(function(data){
				var pre = data.data.replace('// API callback\njsonpCallback(','');
				var object = JSON.parse(pre.slice(0,pre.length - 2));
				var result = [];
				object.feed.entry.map(function(item){
					result.push(parseTechnologyFromGoogleSheets(item));
				});
				var categories = result.map(function(technology) {
					return technology.Categories.map(function(category) {
						return category.toProperCase().trim();
					});
				});
				categories = [' Show All'].concat(_.uniq([].concat.apply([],categories).filter(function(item){return !!item})));
				techData.technologies = result;
				techData.categories = categories;
				return techData;
			});
		};
		var getSingleTechnology = function(tech_id) {
			return (
				techData.technologies ? 
				techData.technologies.filter(function(item){return item.ID === tech_id})[0] : 
				getAllTechnologyData().then(function(the_techData) {
					return the_techData.technologies.filter(function(item){return item.ID === tech_id})[0]
				})
			);
		};
		var checkForTechnologyLoaded = function() {
			return (techData.technologies ? techData : getAllTechnologyData() );
		};

		return {
			'techData': techData,
			'getSingleTechnology': getSingleTechnology,
			'checkForTechnologyLoaded': checkForTechnologyLoaded
		};
	};
	function VideoSize($interval) {
		var dimensions = {
			'width': null,
			'height': null
		};

		return {
			'dimensions': dimensions
		};
	};
	function YouTubeSize($interval) {
		var dimensions = {
			'width': null,
			'height': null
		};

		return {
			'dimensions': dimensions
		};
	};
	function PageTitle() {
		var title = {
			'text': 'BYU Tech Transfer'
		};
		return {
			getTitle: function(){return title.text;},
			setTitle: function(newTitle){title.text=newTitle; return title.text;}
		};
	};

	// RANDOM GLOBAL UTILITIES FOR APP
	var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	function scrollFix($rootScope, $document, $state) {
		$rootScope.$on('$stateChangeSuccess', function() {
			$document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
		});
	};
	

	// APP BOOTSTRAPPING
	app
	.config(Routes)
	.run(scrollFix)
	.directive('fitVids', fitVids)
	.directive('bindVideoSize', bindVideoSize)
	.directive('bindYoutubeSize', bindYoutubeSize)
	.filter('offset', offset)
	.controller('HomeController', HomeController)
	.controller('TechnologiesController', TechnologiesController)
	.controller('TechnologyController', TechnologyController)
	.controller('TechnologyPictureModalController', TechnologyPictureModalController)
	.controller('ContactController', ContactController)
	.controller('TitleController', TitleController)
	.controller('GenericController', GenericController)
	.factory('Emailer', Emailer)
	.factory('TechnologyDetails', TechnologyDetails)
	.factory('VideoSize',VideoSize)
	.factory('YouTubeSize',YouTubeSize)
	.factory('PageTitle', PageTitle)
	.factory('_',function() {
		return _;
	});
})(angular.module('techtransfer',['ui.router','ui.bootstrap','ngAnimate']));