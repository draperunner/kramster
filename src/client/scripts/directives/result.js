'use strict';

angular.module('kramster')
    .directive('result', function () {
      return {
        restrict: 'E',
        templateUrl: '../../views/result.html',
      };
    });
