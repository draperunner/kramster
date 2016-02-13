'use strict';

angular.module('kramster')
    .directive('jumbotron', function () {

        var controller = ['$scope', function ($scope) {
            const subtitles = [
                "Will you improve the statistics?",
                "Where are you on the chart?",
                "It's OK to fail.",
                "Practice makes perfect.",
                "You'll do great!",
                "Remember, grades aren't everything.",
                "Cram with Kramster!"
            ];

            var picked = "";

            $scope.subtitle = function () {
                picked = picked || subtitles[Math.floor(Math.random() * subtitles.length)];
                return picked;
            };
        }];

        return {
            restrict: 'E',
            templateUrl: '../../views/jumbotron.html',
            controller: controller
        };
    });
