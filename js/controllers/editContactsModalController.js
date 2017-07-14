(function(app) {

function EditContactsModalController($modalInstance, Contacts) {
	var ecmc = this;

	Contacts.getContacts()
		.then(function(contacts){ ecmc.contacts = contacts; });

	ecmc.deleteContactEntry = function(contactEntryIndex) { ecmc.contacts.splice(contactEntryIndex, 1); };

	ecmc.addContactEntry = function() { ecmc.contacts.push(''); };

	ecmc.save = function() {
		Contacts.updateContacts(ecmc.contacts);
		ecmc.close();
	};

	ecmc.close = function () { $modalInstance.close(); };
}

app
.controller('EditContactsModalController', EditContactsModalController);
})(angular.module('techtransfer'));