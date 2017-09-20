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
				new: true
			}
		});
}

function EditTechnologyController(Auth, $scope, $state, $stateParams, $modal, _, Categories, Contacts, EditTechnologies) {
	var etc = this;

	etc.new = $stateParams.new;
	etc.technology = $stateParams.technology || {};
	etc.technology.selectedCategories = {};

	if (etc.technology) {
		etc.technology['Old ID'] = etc.technology.ID;

		if (etc.technology.Categories) etc.technology.Categories.split(',')
			.map(function(category){return category.trim();})
			.forEach(function(category){
				etc.technology.selectedCategories[category] = true;
			});

		if (
			etc.technology['Long Description'] &&
			etc.technology['Long Description'].filter(x => x).length
		) etc.technology['Long Description'] =  etc.technology['Long Description'].join('\n\n');

		if (
			etc.technology.Tags &&
			etc.technology.Tags.filter(x => x).length
		) etc.technology.Tags =  etc.technology.Tags.join(' ');

		if (etc.technology['Total Photos']) etc.pictureNumbers = _.range(1, parseInt(etc.technology['Total Photos']) + 1);
	}

	if (!etc.technology || !etc.technology.ID) etc.imageUploadDisabled = true; // Don't allow image uploads until technology has been saved

	getCategories();
	getContacts();


	etc.goTo = function(pagename) {
		$state.go(pagename);
	};

	etc.openEditCategoriesModal = function() {
		$modal.open({
				animation: true,
				templateUrl: 'templates/editCategoriesModal.html',
				controller: 'EditCategoriesModalController as ecmc',
				size: 'lg'
		})
		.result.then(getCategories);
	};

	etc.openConfirmDeleteModal = function() {
		$modal.open({
				animation: true,
				templateUrl: 'templates/confirmDeleteModal.html',
				controller: 'ConfirmDeleteModalController as cdmc',
				size: 'lg'
		});
	};

	etc.openConfirmPhotoDeleteModal = function(photoUrl) {
		$modal.open({
				animation: true,
				templateUrl: 'templates/confirmPhotoDeleteModal.html',
				controller: 'ConfirmPhotoDeleteModalController as cpdmc',
				resolve: { photoUrl: function(){ return photoUrl; } },
				size: 'lg',
		});
	};

	etc.openEditContactsModal = function() {
		$modal.open({
				animation: true,
				templateUrl: 'templates/editContactsModal.html',
				controller: 'EditContactsModalController as ecmc',
				size: 'lg'
		})
		.result.then(function(){setTimeout(getContacts, 1000);});
	};

	etc.saveTechnology = function() {
		var newTechnologyObject = angular.copy(etc.technology);

		var contact = angular.copy(newTechnologyObject.contact);
		delete newTechnologyObject.contact;
		newTechnologyObject['Contact Name'] = contact.name;
		newTechnologyObject['Contact Email'] = contact.email;
		newTechnologyObject['Contact Phone'] = contact.phone;

		var categories = angular.copy(newTechnologyObject.selectedCategories);
		delete newTechnologyObject.selectedCategories;
		newTechnologyObject.Categories = Object.keys(categories).join(',');

		// var links = angular.copy(newTechnologyObject.Links || []);
		// delete newTechnologyObject.Links;
		// newTechnologyObject.Links = links.join(',');

		var media = angular.copy(newTechnologyObject.Media || []);
		delete newTechnologyObject.Media;
		newTechnologyObject['Media 1'] = media[0] ? media[0].link : null;
		newTechnologyObject['Media 2'] = media[1] ? media[1].link : null;
		newTechnologyObject['Media 3'] = media[2] ? media[2].link : null;
		newTechnologyObject['Media 4'] = media[3] ? media[3].link : null;

		var saveFunction = $stateParams.new ? EditTechnologies.addTechnology : EditTechnologies.editTechnology;
		saveFunction(newTechnologyObject)
			.then(function(stuff){
				$scope.$applyAsync(function(){
					etc.new = false;
					etc.technologySaved = true;
					etc.imageUploadDisabled = false; // Allow image uploads since new technology has been saved successfully
				});
			})
			.catch(function(error){
				$scope.$applyAsync(function(){etc.technologyFailedToSave = true;});
			});
	};

	etc.newTechnology = function() {
		etc.technology = {};
		etc.new = true;
		etc.technologyFailedToSave = false;
		etc.technologySaved = false;
	};

	$scope.uploadImage = function(elementRef) {
		var photosSoFar = etc.technology.Photos ? etc.technology.Photos.length + 1 : 1;
		var fileObject = elementRef.files[0];
		var filename = etc.technology.ID+'---'+photosSoFar+'.'+fileObject.type.replace('image/', '');
		var form = document.getElementById('new-technology-file-upload');
		var submitUrl = 'http://tech-transfer.byu.edu/api/imageUpload.php';

		var formData = new FormData();
		formData.append('file', fileObject, filename);

		$.ajax({
        url: submitUrl,
        type: 'post',
				data: formData,
				processData: false,
				contentType: false,
        success: function(){alert("worked");}
    });
	};




	function getCategories() {
		Categories.getCategories()
			.then(function(categories) { etc.categories = categories; });
	}

	function getContacts() {
		Contacts.getContacts()
			.then(function(contacts){
				$scope.$applyAsync(function(){etc.contacts = contacts;});
				if (!etc.technology['Contact Name']) etc.technology.contact = contacts[0];
				else etc.technology.contact = contacts.filter(item => item.name === etc.technology['Contact Name'])[0];
			});
	}
}

app
.config(setupRoute)
.controller('EditTechnologyController', EditTechnologyController);
})(angular.module('techtransfer'));
