angular.module('kramster')
    .controller("BarCtrl", ['$scope', function ($scope) {
        $scope.labels = ['A', 'B', 'C', 'D', 'E', 'F'];

        $scope.data = [
            [12, 24, 36, 34, 27, 45]
        ];

        $scope.colors = [{fillColor: '#e74c3c'}];

        $scope.options = {
            scaleBeginAtZero : false,
            scaleShowGridLines : false,
            scaleShowHorizontalLines: false,
            scaleShowVerticalLines: false,
            showScale: false,
            barShowStroke : false,
            barValueSpacing : 5,
            maintainAspectRatio: true
        };
    }]);
