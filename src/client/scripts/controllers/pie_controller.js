angular.module('kramster')
    .controller("PieCtrl", ['$scope', 'httpRequest', function ($scope, httpRequest) {

        const baseUrl = '/api/stats/';
        const r = $scope.$parent.$parent.route;
        const mode = $scope.$parent.$parent.mode;
        const dataUrl = r ? baseUrl + r.school + '/' + r.course + '/' + (r.document || mode.docMode): baseUrl;

        $scope.labels = ['A', 'B', 'C', 'D', 'E', 'F'];

        $scope.options = {
            segmentShowStroke : false,
            percentageInnerCutout : 0,
            animationEasing : "easeOutBounce",
            animateRotate : true,
            animateScale : false
        };

        httpRequest.get(dataUrl, {}, function (res) {
            var data = [];
            for (var i = 0; i < $scope.labels.length; i++) {
                data.push(res.grades[$scope.labels[i]]);
            }
            $scope.data = data;
        });

    }]);
