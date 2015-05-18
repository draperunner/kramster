'use strict';

angular.module('kramster')
  .controller('DocumentListController', ['$http', '$routeParams', 'apiUrl', function($http, $routeParams, apiUrl) {
    var app = this;
    app.documents = [];
    app.school = $routeParams.school;
    app.course = $routeParams.course;
    $http.get(apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course).
      success(function(data) {
        app.documents = data.sort(function(a, b) {
          /* Sorts in reversed order because we want the newest exams to be on top. (2014 above 2013, etc.) */
          if (a.name < b.name) {
            return 1;
          }
          if (a.name > b.name) {
            return -1;
          }
          return 0;
        });
      });

    this.underscorify = function(documentName) {
      return documentName.replace(/ /g, '_');
    };
  }]);
