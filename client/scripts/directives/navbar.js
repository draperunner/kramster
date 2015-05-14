'use strict';

/**
 * @ngdoc directive
 * @name suckfaceApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('kramster')
  .directive('navbar', function () {
    return {
      restrict: 'E',
      templateUrl: '../../views/navbar.html'
    };
  });
