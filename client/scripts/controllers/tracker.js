'use strict';

/* Google Analytics */
angular.module('kramster')
    .controller('Tracker', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$on('$viewContentLoaded', function (event) {
            $window.ga('send', 'pageview', {page: $location.url()});
        });
    }]);

