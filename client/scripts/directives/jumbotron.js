'use strict';

angular.module('kramster')
    .directive('jumbotron', function () {
        return {
            restrict: 'E',
            templateUrl: '../../views/jumbotron.html'
        };
    });
