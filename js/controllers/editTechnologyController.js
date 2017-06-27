(function(app) {

function setupRoute($stateProvider) {
	$stateProvider
    .state('editTechnology', {
			url: '/edit',
			templateUrl: 'templates/newtechnology.html',
			controller: 'EditTechnologyController as etc',
			params: { 'technology': {} }
		})
		.state('newtechnology', {
			url: '/newtechnology',
			templateUrl: 'templates/newtechnology.html',
			controller: 'EditTechnologyController as etc',
			params: {
				new: false
			}
		});
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

	etc.openConfirmDeleteModal = function() {
		$modal.open({
				animation: true,
				templateUrl: 'templates/confirmDeleteModal.html',
				controller: 'ConfirmDeleteModalController as cdmc',
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

app
.config(setupRoute)
.controller('EditTechnologyController', EditTechnologyController);
})(angular.module('techtransfer'));
