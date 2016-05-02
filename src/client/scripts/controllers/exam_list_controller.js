'use strict';

angular.module('kramster')
  .controller('ExamListController',
    ['$rootScope', '$scope', '$location', 'Helpers', 'httpRequest', '$routeParams', 'apiUrl',
    function ($rootScope, $scope, $location, helpers, httpRequest, $routeParams, apiUrl) {
      $rootScope.loading = false;

      $scope.helpers = helpers;

      $scope.route = {
        school: $routeParams.school,
        course: $routeParams.course,
      };

      var app = this;
      app.exams = [];

      var url = apiUrl + 'list/exams/' + $routeParams.school + '/' + $routeParams.course;
      var query = { sort: '-alphabetically' };

      httpRequest.get(url, query, function (data) {
        app.exams = data;
      });

    },
    ]);
