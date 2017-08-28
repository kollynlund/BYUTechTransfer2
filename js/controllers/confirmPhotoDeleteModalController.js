(function(app) {

  function ConfirmPhotoDeleteModalController($modalInstance, images, technologyId, photoNumber) {
    this.photoUrl = photoUrl;

    this.close = function () {
      $modalInstance.close();
    };

    this.deleteImage = function(technologyId, photoNumber) {
      images.deleteImage(technologyId, photoNumber)
        .then(function(response){console.log('Delete image response:', response);})
        .then(function(){$modalInstance.close();})
        .catch(function(error){console.log('Error deleting image:', error);});
    };
  }

  app
  .controller('ConfirmPhotoDeleteModalController', ConfirmPhotoDeleteModalController);
  })(angular.module('techtransfer'));
