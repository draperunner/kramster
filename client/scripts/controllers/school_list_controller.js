'use strict';

angular.module('kramster')
  .controller('SchoolListController', ['$scope', 'Helpers', '$http', 'apiUrl', function($scope, helpers, $http, apiUrl) {
    $scope.helpers = helpers;
    var app = this;
    app.schools = [];
    $http.get(apiUrl + 'list/schools').success(function(data) {
      app.schools = data.sort();
    });

  }]);

