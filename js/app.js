window.googleDocCallback = function () { return true; };
var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
String.prototype.toProperCase = function () {
    return this.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

angular.module('techtransfer',['ui.router','ui.bootstrap','ngAnimate'])
.config(function($stateProvider, $urlRouterProvider) {
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
			controller: 'AboutController as ac'
		})

		.state('contact', {
			url: '/contact/{tech_id}',
			templateUrl: 'templates/contact.html',
			controller: 'ContactController as cc'
		})

		.state('technologies', {
			url: '/technologies',
			templateUrl: 'templates/technologies.html',
			controller: 'TechnologiesController as tc'
		})
			.state('technology', {
				url: '/technology/{tech_id}',
				templateUrl: 'templates/technology.html',
				controller: 'TechnologyController as stc'
			})

		.state('resources', {
			url: '/resources',
			templateUrl: 'templates/resources.html',
			controller: 'ResourcesController as rc'
		});
})
.run(function($rootScope, TechnologyDetails) {
	TechnologyDetails.getTechs().then(function(data) {
		$rootScope.technologies = data.technologies;
		$rootScope.categories = data.categories;
		$rootScope.categorySearch = {'Categories':'Show All'};
		console.log(data.categories);
	});
})

.controller('HomeController', function($state) {
	var hmc = this;

	hmc.goTo = function(pagename) {
		$state.go(pagename);
	};
})
.controller('TechnologiesController', function($rootScope, $state) {
	var tc = this;

	tc.searchText = '';

	tc.goToTech = function(tech_id) {
		$state.go('technology',{'tech_id':tech_id});
	};

	tc.goTo = function(pagename) {
		$state.go(pagename);
	};
})
.controller('TechnologyController', function($rootScope, $scope, $state, $stateParams) {
	var stc = this;

	stc.the_tech = {};
	$scope.$watch(
		function(scope){return $rootScope.technologies}, 
		function(new_value, old_value) {
			if (new_value) {
				stc.the_tech = new_value.filter(function(item){return item.ID === $stateParams.tech_id})[0];
			}
		}
	);

	stc.contactAboutTech = function(tech_id) {
		$state.go('contact',{'tech_id':tech_id});
	};
	stc.goTo = function(pagename) {
		$state.go(pagename);
	};
})
.controller('ResourcesController', function($state) {
	var rc = this;
	rc.goTo = function(pagename) {
		$state.go(pagename);
	};
})
.controller('ContactController', function($scope, $state, $stateParams, Emailer) {
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
})
.controller('AboutController', function($state) {
	var ac = this;
	ac.goTo = function(pagename) {
		$state.go(pagename);
	};
})

.controller('HeaderController', function($state) {
 //	$scope.windowWidth = $window.innerWidth;
 //	$scope.showMenu = false;
 //	// Watch for changes in the window width
	// $(window).on("resize.doResize", function (){
	// 	$scope.$apply(function(){
 //			$scope.showMenu = false;
	// 		$scope.windowWidth = $window.innerWidth;
	// 	});
	// });
	// $scope.$on("$destroy",function (){
	// 	// Kill resize listener
	// 	 $(window).off("resize.doResize");
	// });
	// // -------------------------------------

	this.goTo = function(pagename) {
		$state.go(pagename);
	};
})
.controller('FooterController', function($state) {
	this.currentYear = new Date().getFullYear();
	this.goTo = function(pagename) {
		$state.go(pagename);
	};
})
.controller('TitleController', function(PageTitle) {
	var tc = this;
	tc.title = PageTitle.getTitle;
})

.factory('Emailer',function($http) {
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
})
.factory('TechnologyDetails',function($http, _) {
	var parseTechnology = function(tech_object) {
		return {
			'About the Market': tech_object.gsx$aboutthemarket.$t,
			'Categories': tech_object.gsx$categories.$t,
			'Contact Email': tech_object.gsx$contactemail.$t,
			'Contact Name': tech_object.gsx$contactname.$t,
			'Contact Phone': tech_object.gsx$contactphone.$t,
			'ID': tech_object.gsx$id.$t,
			'Image': tech_object.gsx$image.$t,
			'Links': tech_object.gsx$links.$t.split(','),
			'Long Description': tech_object.gsx$longdescription.$t,
			'Name': tech_object.gsx$name.$t,
			'PI': tech_object.gsx$pi.$t,
			'Short Description': tech_object.gsx$shortdescription.$t,
			'Tags': tech_object.gsx$tags.$t
		};
	};
	return {
		getTechs: function() {
			return $http.get('https://spreadsheets.google.com/feeds/list/17Tf9_PvDC-fx3-vTHkmopjAndc94ZTXWFp-q0jxJjrM/1/public/values?alt=json-in-script&callback=googleDocCallback').then(function(data){
				var pre = data.data.replace('// API callback\ngoogleDocCallback(','');
				var object = JSON.parse(pre.slice(0,pre.length - 2));
				var result = [];
				object.feed.entry.map(function(item){
					result.push(parseTechnology(item));
				});
				var categories = result.map(function(technology) {
					var pre = technology.Categories.split(',');
					return pre.map(function(category) {
						return category.toProperCase().trim();
					});
				});
				categories = ['Show All'].concat(_.uniq([].concat.apply([],categories).filter(function(item){return !!item})));
				return {
					'technologies':result,
					'categories':categories
				};
			})
		}
	};
})
.factory('PageTitle',function() {
	var title = 'BYU Tech Transfer';
	return {
		getTitle: function(){return title;},
		setTitle: function(newTitle){title=newTitle; return title;}
	};
})

.factory('_',function() {
	return _;
});
