'use strict';

angular.module('kramster')
    .controller('CourseListController', ['$scope', 'httpRequest', '$routeParams', 'apiUrl', 'Helpers', function ($scope, httpRequest, $routeParams, apiUrl, helpers) {
        $scope.helpers = helpers;
        var app = this;
        app.courses = [];
        app.school = $routeParams.school;

        httpRequest.get(apiUrl + 'list/' + $routeParams.school, function (data) {
            app.courses = data.sort();
        });

    }]);
