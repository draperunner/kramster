'use strict';

angular.module('kramster')
  .controller('CourseListController', ['$http', '$routeParams', 'apiUrl', function($http, $routeParams, apiUrl) {
    var app = this;
    app.courses = [];
    app.school = $routeParams.school;
    $http.get(apiUrl + 'courses/' + $routeParams.school).
      success(function(data) {
        app.courses = data;
      });

    this.underscorify = function(courseName) {
      return courseName.replace(/ /g, '_');
    };
  }]);
