'use strict';

angular.module('kramster')
    .controller('DocumentListController', ['$scope', 'Helpers', 'httpRequest', '$routeParams', 'apiUrl', function ($scope, helpers, httpRequest, $routeParams, apiUrl) {

        $scope.helpers = helpers;

        var app = this;
        app.documents = [];

        $scope.route = {
            school: $routeParams.school,
            course: $routeParams.course
        };

        httpRequest.get(apiUrl + 'list/' + $routeParams.school + '/' + $routeParams.course, function (data) {
            app.documents = data.sort(helpers.reversedComparison);
        });

    }]);
