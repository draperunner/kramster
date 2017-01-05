/* eslint-disable angular/controller-as */

angular.module('kramster')
  .controller('PieController', ['$scope', '$routeParams', '$route', 'httpRequest',
    function PieController($scope, $routeParams, $route, httpRequest) {
      const baseUrl = '/api/stats/';
      const r = $routeParams;
      const mode = $route.current.locals.mode;

      const dataUrl = r && Object.keys(r).length > 0
        ? `${baseUrl + r.school}/${r.course}/${r.exam || mode}`
        : baseUrl;

      const params = {};
      if (mode && mode.docMode && mode.docMode === 'random') {
        params.numQuestions = $scope.numberOfQuestions();
      }

      $scope.labels = ['A', 'B', 'C', 'D', 'E', 'F'];

      $scope.options = {
        segmentShowStroke: false,
        percentageInnerCutout: 0,
        animationEasing: 'easeOutBounce',
        animateRotate: true,
        animateScale: false,
      };

      httpRequest.get(dataUrl, params, (res) => {
        const data = [];
        for (let i = 0; i < $scope.labels.length; i++) {
          data.push(res.grades[$scope.labels[i]]);
        }

        $scope.data = data;
      });
    },
  ]);
