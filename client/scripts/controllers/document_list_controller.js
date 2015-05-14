'use strict';

angular.module('kramster')
  .controller('DocumentListController', ['$http', '$routeParams', 'apiUrl', function($http, $routeParams, apiUrl) {
    var app = this;
    app.documents = [];
    app.school = $routeParams.school;
    app.course = $routeParams.course;
    $http.get(apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course).
      success(function(data) {
        app.documents = data;
      });

    this.underscorify = function(documentName) {
      return documentName.replace(/ /g, '_');
    };
  }]);
