(function(app) {

function setupRoute($stateProvider) {
	$stateProvider
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
		});
}

function TechnologyController($scope, $state, $modal, _, Auth, technologies, technology) {
	var stc = this;
	stc.selectedTech = technology;
	stc.photoCount = parseInt(stc.selectedTech['Total Photos']);

	stc.getPhotoRange = function(count) {
		return new Array(count);
	}

	stc.getRandomString = function() {
		return parseInt(Date.now()/1000);
	}

	Auth.Auth().then(function(isAuthed){$scope.$applyAsync(function(){stc.isAuthed = isAuthed;});});

	// stc.pictureCount = function() {
	// 	stc.photoCount = parseInt(_.range(1, parseInt(stc.selectedTech['Total Photos']) + 1));
	// }

	//stc.pictureNumbers = _.range(1, parseInt(stc.selectedTech['Total Photos']) + 1);

	stc.openDetailModal = function(mediaOrTechId, photoNumber, photoType) {
		photoType = photoType + "?lastModified=" + this.getRandomString();
		var modalInstance = $modal.open({
				animation: true,
				// template: mediaOrTechId.type === 'video' ?
				// 			'<div fit-vids><iframe class="vid" src="'+mediaOrTechId.link+'" frameborder="0" allowfullscreen></iframe></div>'
				// 			: '<div><img class="img" src="http://tech-transfer.byu.edu/api/uploads/'+mediaOrTechId+'---'+photoNumber+'.'+photoType+'"></div>',
				template: (mediaOrTechId.indexOf("youtube.com") > -1 || mediaOrTechId.indexOf("vimeo.com") > -1) ?
							'<div fit-vids><iframe class="vid" src="'+mediaOrTechId+'" frameborder="0" allowfullscreen></iframe></div>'
							: '<div><img class="img" src="http://tech-transfer.byu.edu/api/uploads/'+mediaOrTechId+'---'+photoNumber+'.'+photoType+'"></div>',
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
		$state.go('editTechnology', {'technology': technology});
	};

	function nextTech(current_tech_id) {
		// Default to current technology if all else fails
		var new_tech_id = stc.selectedTech.ID;
		if (technologies) {
			var current_index = technologies.technologies.map(function(item){return item.ID;}).indexOf(stc.selectedTech.ID);
			new_tech_id = technologies.technologies[(current_index+1 === technologies.technologies.length ? 0 : current_index+1)].ID;
		}
		$state.go('technology',{'tech_id': new_tech_id});
	}
	function previousTech(current_tech_id) {
		// Default to current technology if all else fails
		var new_tech_id = stc.selectedTech.ID;
		if (technologies) {
			var current_index = technologies.technologies.map(function(item){return item.ID;}).indexOf(stc.selectedTech.ID);
			new_tech_id = technologies.technologies[(current_index === 0 ? (technologies.technologies.length-1) : current_index-1)].ID;
		}
		$state.go('technology',{'tech_id': new_tech_id});
	}
}

app
.config(setupRoute)
.controller('TechnologyController', TechnologyController);
})(angular.module('techtransfer'));
