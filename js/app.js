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
	}
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
	.directive('bindVideoSize', bindVideoSize)
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
	.factory('PageTitle', PageTitle)
	.factory('_',function() {
		return _;
	});
})(angular.module('techtransfer',['ui.router','ui.bootstrap','ngAnimate','fitVids']));