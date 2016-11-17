angular.module('kramster')
  .controller('PieController', ['$scope', 'httpRequest', function PieController($scope, httpRequest) {
    const baseUrl = '/api/stats/';
    const r = $scope.$parent.$parent.route;
    const mode = $scope.$parent.$parent.mode;
    const dataUrl = r
      ? `${baseUrl + r.school}/${r.course}/${r.exam || mode.docMode}`
      : baseUrl;

    const params = {};
    if (mode && mode.docMode && mode.docMode === 'random') {
      params.numQuestions = $scope.numberOfQuestions();
    }

    const vm = this;

    vm.labels = ['A', 'B', 'C', 'D', 'E', 'F'];

    vm.options = {
      segmentShowStroke: false,
      percentageInnerCutout: 0,
      animationEasing: 'easeOutBounce',
      animateRotate: true,
      animateScale: false,
    };

    httpRequest.get(dataUrl, params, (res) => {
      const data = [];
      for (let i = 0; i < vm.labels.length; i++) {
        data.push(res.grades[vm.labels[i]]);
      }

      vm.data = data;
    });
  },
  ]);
