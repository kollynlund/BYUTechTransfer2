(function(app){

function TechnologyDetails($http, $sce, $sessionStorage, _) {
	var techData = $sessionStorage.techData || {
		'technologies': null,
		'categories': null
	};

	function getMediaType(link) {
		if (!link) return undefined;
		return link.indexOf('youtube.com') > -1 ? 
		'video' : 
			link.indexOf('vimeo.com') > -1 ? 
			'video' : link ? 
				'photo' : undefined;
	}
	var parseTechnology = function(tech_object) {
		return {
			'About the Market': tech_object['About the Market'],
			'Categories': tech_object.Categories,
			'Contact Email': tech_object['Contact Email'],
			'Contact Name': tech_object['Contact Name'],
			'Contact Phone': tech_object['Contact Phone'],
			'ID': tech_object.ID,
			'Media': [
				{'link': tech_object['Media 1'], 'type': getMediaType(tech_object['Media 1'])},
				{'link': tech_object['Media 2'], 'type': getMediaType(tech_object['Media 2'])},
				{'link': tech_object['Media 3'], 'type': getMediaType(tech_object['Media 3'])},
				{'link': tech_object['Media 4'], 'type': getMediaType(tech_object['Media 4'])}
			],
			'Links': tech_object.Links ? tech_object.Links.split(',').filter(function(item){return item !== '';}) : [],
			'Long Description': tech_object['Long Description'] ? tech_object['Long Description'].split('\n\n') : '',
			'Name': tech_object.Name,
			'PI': tech_object.PI,
			'Short Description': tech_object['Short Description'],
			'Tags': tech_object.Tags ? tech_object.Tags.split(' ') : [],
			'Photos': tech_object.photos.split(',')
		};
	};
	var getAllTechnologyData = function() {
		return $http.get('http://tech-transfer.byu.edu/api/getTechs.php')
		.then(function(result){return result.data;})
		.then(function(data){return data.map(parseTechnology);})
		.then(function(result) {
			var categories = result.map(function(technology) {
				return technology.Categories ? technology.Categories.split(',').map(function(category) {
					return ProperCase(category).trim();
				}) : [];
			});
			categories = [' Show All'].concat(_.uniq([].concat.apply([],categories).filter(function(item){return !!item})));
			techData.technologies = result;
			techData.categories = categories;
			$sessionStorage.techData = techData;
			console.log('tekdutuh', techData);
			return techData;
		});
	};
	var getSingleTechnology = function(tech_id) {
		return (
			techData.technologies ? 
			techData.technologies.filter(function(item){return item.ID === tech_id})[0] : 
			getAllTechnologyData().then(function(the_techData) {
				return the_techData.technologies.filter(function(item){return item.ID === tech_id})[0]
			})
		);
	};
	var checkForTechnologyLoaded = function() {
		// return ( techData.technologies ? techData : getAllTechnologyData() );
		return getAllTechnologyData();
	};

	checkForTechnologyLoaded();
	return {
		'techData': techData,
		'getSingleTechnology': getSingleTechnology,
		'checkForTechnologyLoaded': checkForTechnologyLoaded
	};
}

function ProperCase(inputString) {
	return inputString.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

app
.factory('TechnologyDetails', TechnologyDetails);
})(angular.module('techtransfer'));