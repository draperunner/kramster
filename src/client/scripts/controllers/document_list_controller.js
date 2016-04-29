'use strict';

angular.module('kramster')
  .controller('DocumentListController',
    ['$scope', '$location', 'Helpers', 'httpRequest', '$routeParams', 'apiUrl',
    function ($scope, $location, helpers, httpRequest, $routeParams, apiUrl) {

      $scope.helpers = helpers;

      $scope.route = {
        school: $routeParams.school,
        course: $routeParams.course,
      };

      var app = this;
      app.documents = [];

      var url = apiUrl + 'list/exams/' + $routeParams.school + '/' + $routeParams.course;
      var query = { sort: '-alphabetically' };

      httpRequest.get(url, query, function (data) {
        app.documents = data;
      });

    },
    ]);
