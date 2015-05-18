'use strict';

angular.module('kramster')
  .controller('CourseListController', ['$scope', '$http', '$routeParams', 'apiUrl', 'Helpers', function($scope, $http, $routeParams, apiUrl, helpers) {
    $scope.helpers = helpers;
    var app = this;
    app.courses = [];
    app.school = $routeParams.school;
    $http.get(apiUrl + 'courses/' + $routeParams.school).
      success(function(data) {
        app.courses = data.sort();
      });

  }]);
