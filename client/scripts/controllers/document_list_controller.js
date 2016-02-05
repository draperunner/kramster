'use strict';

angular.module('kramster')
    .controller('DocumentListController', ['$scope', '$location', 'Helpers', 'httpRequest', '$routeParams', 'apiUrl',
        function ($scope, $location, helpers, httpRequest, $routeParams, apiUrl) {

        $scope.helpers = helpers;

        $scope.route = {
            school: $routeParams.school,
            course: $routeParams.course
        };

        var app = this;
        app.documents = [];

        httpRequest.get(apiUrl + 'list/' + $routeParams.school + '/' + $routeParams.course, function (data) {
            app.documents = data.sort(helpers.reversedComparison);
        });

    }]);
