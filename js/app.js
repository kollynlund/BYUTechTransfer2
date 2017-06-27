window.jsonpCallback = function () { return true; };
String.prototype.toProperCase = function () {
	return this.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

(function(app) {
	// ROUTING
	function Routes($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/login');

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

			.state('login', {
				url: '/login',
				templateUrl: 'templates/login.html',
				controller: 'LoginController as lc'
			})

			.state('newtechnology', {
				url: '/newtechnology',
				templateUrl: 'templates/newtechnology.html',
				controller: 'EditTechnologyController as etc',
				params: {
					new: false
				}
			})

			.state('edittechnology', {
				url: '/edit',
				templateUrl: 'templates/newtechnology.html',
				controller: 'EditTechnologyController as etc',
				params: {
					'technology': {}
				}
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
	}

	function Config($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
	    'self',
	    'https://www.youtube.com/**',
	    'http://www.youtube.com/**',
	    'https://www.vimeo.com/**',
	    'http://www.vimeo.com/**'
	  ]);
	}

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
	}
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
	function offset() {
		return function(input, start) {
			start = parseInt(start, 10);
			return input.slice(start);
		};
	}

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
	}
	function TechnologiesController($scope, $state, $filter, technologies, $sessionStorage, Auth) {
		var tc = this;

		Auth.Auth().then(function(isAuthed){$scope.$applyAsync(function(){tc.isAuthed = isAuthed;});});
		tc.freshPage = true;
		tc.techData = technologies;
		tc.relevantTech = tc.techData.technologies.slice(0);
		tc.pages = Math.ceil(tc.techData.technologies.length / 10);
		tc.$storage = $sessionStorage.$default({
			searchText:'',
			categorySearch: {'Categories':' Show All'},
			currentPage: 0
		});
		tc.goToTech = function(tech_id) {
			$state.go('technology',{'tech_id':tech_id});
		};
		tc.goTo = function(pagename) {
			$state.go(pagename);
		};
		tc.editTechnology = function($event, technology) {
			$event.stopPropagation();
			$state.go('edittechnology', {'technology': technology});
		};
		tc.newTechnology = function($event) {
			$event.stopPropagation();
			$state.go('newtechnology', {'new': true});
		};

		function searchWatch(newVals, oldVals) {
			tc.relevantTech = $filter('filter')(tc.techData.technologies, newVals[0]);
			tc.relevantTech = $filter('filter')(tc.relevantTech, (newVals[1] === ' Show All' ? undefined : {'Categories':newVals[1]}));
			tc.pages = Math.ceil(tc.relevantTech.length / 10);
			if (!tc.freshPage) {
				tc.$storage.currentPage = 0;
			}
			else {
				tc.freshPage = false;
			}
		};
		$scope.$watchCollection(function(){return [tc.$storage.searchText, tc.$storage.categorySearch.Categories]}, searchWatch);
	}
	function TechnologyController($scope, $state, $modal, Auth, technologies, technology) {
		var stc = this;

		Auth.Auth().then(function(isAuthed){$scope.$applyAsync(function(){stc.isAuthed = isAuthed;})});
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
		stc.editTechnology = function(technology) {
			$state.go('edittechnology', {'technology': technology});
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
	}
	function TechnologyPictureModalController($modalInstance) {
		this.close = function () {
			$modalInstance.close();
		};
	}
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
	}
	function TitleController(PageTitle) {
		var tc = this;
		tc.title = PageTitle.getTitle();
	}
	function LoginController(Auth, $state) {
		var lc = this;
		lc.auth = function() {
			Auth.Auth(lc.username, lc.password)
			.then(function(isAuthed) {
				if (isAuthed) $state.go('home');
			});
		};
	}
	function EditTechnologyController(Auth, $state, $stateParams, $modal) {
		var etc = this;

		etc.categories = ['engineering', 'mechanical devices & processes', 'software', 'chemistry', 'diagnostics & drug delivery', 'electronics & instrumentation', 'energy/environment/resources', 'engineered structures & materials', 'life sciences', 'microfluidics', 'pharmaceuticals/nutraceuticals', 'physics', 'biotech/medical', 'data storage', 'education', 'food/agriculture'];

		etc.new = $stateParams.new;
		etc.technology = $stateParams.technology || {};
		etc.technology.selectedCategories = {};
		etc.technology && etc.technology.Categories ? etc.technology.Categories.split(',')
		.map(function(category){return category.trim();})
		.forEach(function(category){
			etc.technology.selectedCategories[category] = true;
		}) : null;
		console.log(angular.copy(etc.technology));

		etc.goTo = function(pagename) {
			$state.go(pagename);
		};

		etc.openEditCategoriesModal = function() {
			$modal.open({
					animation: true,
					templateUrl: 'templates/editCategoriesModal.html',
					controller: 'EditCategoriesModalController as ecmc',
					size: 'lg'
			});
		};

		etc.openEditContactsModal = function() {
			$modal.open({
					animation: true,
					templateUrl: 'templates/editContactsModal.html',
					controller: 'EditContactsModalController as ecmc',
					size: 'lg'
			});
		};
	}
	function EditContactsModalController($modalInstance) {
		this.close = function () {
			$modalInstance.close();
		};
	}
	function EditCategoriesModalController($modalInstance) {
		this.close = function () {
			$modalInstance.close();
		};
	}

	// SERVICES
	function Auth($http, $q) {
		return {
			Auth: function(username, password) {
				if (new Date(localStorage.byuttosession) > (new Date(new Date().valueOf() - (1000*60*60*4)))) return $q(function(resolve) {resolve(true);});
				return $http({
					method: 'POST',
					url: 'api/auth.php',
					data: {
						username: username,
						password: password
					}
				})
				.then(function(response){
					if (response.data.success) localStorage.byuttosession = new Date().toISOString();
					return response.data.success;
				})
				.catch(function(err){return false;});
			}
		};
	}
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
	function TechnologyDetails($http, $sce, $sessionStorage, _) {
		var techData = $sessionStorage.techData || {
			'technologies': null,
			'categories': null
		};

		function getMediaType(link) {
			if (!link) return undefined;
			return link.indexOf('youtube.com') > -1 ? 
			'video' : 
				link.indexOf('vimeo.com') > -1 ? 
				'video' : link ? 
					'photo' : undefined;
		}
		var parseTechnology = function(tech_object) {
			if (tech_object.ID === '2016-045') console.log('bograngles', {
				'About the Market': tech_object['About the Market'],
				'Categories': tech_object.Categories,
				'Contact Email': tech_object['Contact Email'],
				'Contact Name': tech_object['Contact Name'],
				'Contact Phone': tech_object['Contact Phone'],
				'ID': tech_object.ID,
				'Media': [
					{'link': tech_object['Media 1'], 'type': getMediaType(tech_object['Media 1'])},
					{'link': tech_object['Media 2'], 'type': getMediaType(tech_object['Media 2'])},
					{'link': tech_object['Media 3'], 'type': getMediaType(tech_object['Media 3'])},
					{'link': tech_object['Media 4'], 'type': getMediaType(tech_object['Media 4'])}
				],
				'Links': tech_object.Links ? tech_object.Links.split(',').filter(function(item){return item !== '';}) : [],
				'Long Description': tech_object['Long Description'] ? tech_object['Long Description'].split('\n\n') : '',
				'Name': tech_object.Name,
				'PI': tech_object.PI,
				'Short Description': tech_object['Short Description'],
				'Tags': tech_object.Tags ? tech_object.Tags.split(',') : []
			});
 			return {
				'About the Market': tech_object['About the Market'],
				'Categories': tech_object.Categories,
				'Contact Email': tech_object['Contact Email'],
				'Contact Name': tech_object['Contact Name'],
				'Contact Phone': tech_object['Contact Phone'],
				'ID': tech_object.ID,
				'Media': [
					{'link': tech_object['Media 1'], 'type': getMediaType(tech_object['Media 1'])},
					{'link': tech_object['Media 2'], 'type': getMediaType(tech_object['Media 2'])},
					{'link': tech_object['Media 3'], 'type': getMediaType(tech_object['Media 3'])},
					{'link': tech_object['Media 4'], 'type': getMediaType(tech_object['Media 4'])}
				],
				'Links': tech_object.Links ? tech_object.Links.split(',').filter(function(item){return item !== '';}) : [],
				'Long Description': tech_object['Long Description'] ? tech_object['Long Description'].split('\n\n') : '',
				'Name': tech_object.Name,
				'PI': tech_object.PI,
				'Short Description': tech_object['Short Description'],
				'Tags': tech_object.Tags ? tech_object.Tags.split(',') : []
			};
		};
		var getAllTechnologyData = function() {
			return $http.get('http://tech-transfer.byu.edu/api/getTechs.php')
			.then(function(result){return result.data;})
			.then(function(data){return data.map(parseTechnology);})
			.then(function(result) {
				var categories = result.map(function(technology) {
					return technology.Categories ? technology.Categories.split(',').map(function(category) {
						return category.toProperCase().trim();
					}) : [];
				});
				categories = [' Show All'].concat(_.uniq([].concat.apply([],categories).filter(function(item){return !!item})));
				techData.technologies = result;
				techData.categories = categories;
				$sessionStorage.techData = techData;
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
			// return ( techData.technologies ? techData : getAllTechnologyData() );
			return getAllTechnologyData();
		};

		checkForTechnologyLoaded();
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
	}
	

	// APP BOOTSTRAPPING
	app
	.config(Routes)
	.config(Config)
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
	.controller('LoginController', LoginController)
	.controller('EditTechnologyController', EditTechnologyController)
	.controller('EditContactsModalController', EditContactsModalController)
	.controller('EditCategoriesModalController', EditCategoriesModalController)
	.factory('Auth', Auth)
	.factory('Emailer', Emailer)
	.factory('TechnologyDetails', TechnologyDetails)
	.factory('VideoSize',VideoSize)
	.factory('YouTubeSize',YouTubeSize)
	.factory('PageTitle', PageTitle)
	.factory('_',function() {
		return _;
	});
})(angular.module('techtransfer',['ui.router','ui.bootstrap','ngAnimate','ngStorage']));