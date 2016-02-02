angular.module('kramster')
    .controller("BarCtrl", ['$scope', 'httpRequest', function ($scope, httpRequest) {

        $scope.labels = ['A', 'B', 'C', 'D', 'E', 'F'];
        $scope.data = [[]];

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

        httpRequest.get('http://localhost:8000/api/stats', function (res) {
            var data = [];
            for (var i = 0; i < $scope.labels.length; i++) {
                data.push(res.grades[$scope.labels[i]]);
            }
            $scope.data[0] = data;
        });

    }]);