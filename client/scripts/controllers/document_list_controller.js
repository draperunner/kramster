'use strict';

angular.module('kramster')
  .controller('DocumentListController', ['$scope', 'Helpers', '$http', '$routeParams', 'apiUrl', function($scope, helpers, $http, $routeParams, apiUrl) {

		$scope.helpers = helpers;

		var app = this;
    app.documents = [];

		$scope.route = {
			school: $routeParams.school,
			course: $routeParams.course
		};

    $http.get(apiUrl + 'list/' + $routeParams.school + '/' + $routeParams.course).
      success(function(data) {
        app.documents = data.sort(function(a, b) {

          /* Sorts in reversed order because we want the newest exams to be on top. (2014 above 2013, etc.)
          * Somehow simply returning b-a does not work.*/

					if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          return 0;
        });
      });
  }]);
