'use strict';

angular.module('kramster')
    .controller('SchoolListController', ['$scope', '$location', 'Helpers', 'httpRequest', 'apiUrl', function ($scope, $location, helpers, httpRequest, apiUrl) {

        // Returns a pretty header for the school (the abbreviated name)
        this.header = function (school) {
            // Find abbreviation enclosed in parenthesis
            const abb = helpers.findSubstringEnclosedInParenthesis(school);
            if (abb) return abb[1];
            // If no abbreviation, make one from the leading letters in each word
            return school.split(' ').map(function (e) { return e[0]}).join('');
        };

        // Returns the full name of the school. Removes abbr. and parenthesis from school string
        this.name = function (school) {
            // Find abbreviation enclosed in parenthesis
            const abb = helpers.findSubstringEnclosedInParenthesis(school);
            if (abb) return school.replace(abb[0], '');
            return school;
        };

        $scope.helpers = helpers;
        var app = this;
        app.schools = [];

        httpRequest.get(apiUrl + 'list/schools', function (data) {
            app.schools = data.sort();
        });

    }]);
