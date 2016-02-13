'use strict';

angular.module('kramster')
    .controller('CourseListController', ['$scope', '$location', 'httpRequest', '$routeParams', 'apiUrl', 'Helpers',
        function ($scope, $location, httpRequest, $routeParams, apiUrl, helpers) {

        // Returns a pretty header for the course (the course code)
        this.header = function (course) {
            return course.split(' ')[0].toUpperCase();
        };

        // Returns the full name of the course. Removes course code
        this.name = function (course) {
            return course.replace(course.split(' ')[0], '').trim();
        };

        $scope.helpers = helpers;
        var app = this;
        app.courses = [];
        app.school = $routeParams.school;

        httpRequest.get(apiUrl + 'list/' + $routeParams.school, function (data) {
            app.courses = data.sort();
        });

    }]);
