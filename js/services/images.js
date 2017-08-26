(function(app){
  
  function Images($http, $q) {
    function deleteImage(ID, imageNumber) {
      return $http({
        method: 'POST',
        url: 'http://tech-transfer.byu.edu/' + 'api/imageDelete.php',
        data: {
          ID: ID,
          "Image Number": imageNumber 
        }
      })
      .then(function(response){
        if (response.success) return response.success;
      })
      .catch(function(err){return false;});
    }

    return {
      deleteImage: deleteImage,
    };
  }
  
  app
  .factory('Images', Images);
  })(angular.module('techtransfer'));