(function(app) {
  //, images, technologyId, photoNumber
  function ConfirmPhotoDeleteModalController($modalInstance, photoUrl, Images) {
    this.photoUrl = photoUrl;

  	this.getRandomString = function() {
  		return parseInt(Date.now()/1000);
  	}

    this.close = function () {
      $modalInstance.close();
    };

    this.deleteImage = function() {
      // set technologyId and photoNumber from photoUrl
      var url = this.photoUrl;
      var parts = this.photoUrl.match(/uploads\/(.*)/)[1].split("---");
      var technologyId = parts[0];
      var photoNumber = parts[1];

      Images.deleteImage(technologyId, photoNumber)
        .then(function(response){console.log('Delete image response:', response);})
        .then(function(){
          $modalInstance.close();
        })
        .catch(function(error){console.log('Error deleting image:', error);});
    };
  }

  app
  .controller('ConfirmPhotoDeleteModalController', ConfirmPhotoDeleteModalController);
  })(angular.module('techtransfer'));
