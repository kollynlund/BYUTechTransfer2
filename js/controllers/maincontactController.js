(function(app) {

function setupRoute($stateProvider) {
	$stateProvider
    .state('maincontact', {
      url: '/maincontact',
      templateUrl: 'templates/maincontact.html',
      controller: 'ContactController as cc'
    });
}

var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
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

app
.config(setupRoute)
.controller('maincontactController', mainContactController);
})(angular.module('techtransfer'));
