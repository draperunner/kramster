'use strict';

angular.module('kramster')
	.controller('SchoolListController', ['$scope', 'Helpers', 'httpRequest', 'apiUrl', function ($scope, helpers, httpRequest, apiUrl) {

		$scope.helpers = helpers;
		var app = this;
		app.schools = [];

		httpRequest.getArray(apiUrl + 'list/schools', function (data) {
			app.schools = data.sort();
		});

	}]);

