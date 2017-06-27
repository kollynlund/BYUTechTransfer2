(function(app) {

function TitleController(PageTitle) {
  var tc = this;
  tc.title = PageTitle.getTitle();
}

app
.controller('TitleController', TitleController);
})(angular.module('techtransfer'));