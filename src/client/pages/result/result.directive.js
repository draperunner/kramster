'use strict';

angular.module('kramster')
    .directive('result', function () {
      return {
        restrict: 'E',
        templateUrl: '/pages/result/result.html',
      };
    });
