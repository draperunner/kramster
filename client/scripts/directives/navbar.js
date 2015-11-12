'use strict';

angular.module('kramster')
    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: '../../views/navbar.html'
        };
    });
