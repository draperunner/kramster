'use strict';

angular.module('kramster')
  .controller('SchoolListController', ['$http', 'apiUrl', function($http, apiUrl) {
    var app = this;
    app.schools = [];
    $http.get(apiUrl + 'schools').success(function(data) {
      app.schools = data;
    });

    this.underscorify = function(schoolName) {
      return schoolName.replace(/ /g, '_');
    };
      
  }]);

