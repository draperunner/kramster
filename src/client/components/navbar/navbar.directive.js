'use strict';

angular.module('kramster')
    .directive('navbar', function () {

      var controller = ['$scope', '$location', function ($scope, $location) {
        $scope.onRootLocation = function () {
          return $location.url() === '/';
        };
      },
      ];

      return {
        restrict: 'E',
        templateUrl: '/components/navbar/navbar.html',
        controller: controller,
      };
    });
