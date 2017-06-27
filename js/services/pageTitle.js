(function(app){

function PageTitle() {
	var title = {
		'text': 'BYU Tech Transfer'
	};
	return {
		getTitle: function(){return title.text;},
		setTitle: function(newTitle){title.text=newTitle; return title.text;}
	};
}

app
.factory('PageTitle', PageTitle);
})(angular.module('techtransfer'));