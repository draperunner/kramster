angular.module('kramster')
  .controller('BarController', ['$scope', 'httpRequest', function BarController($scope, httpRequest) {
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
    vm.data = [[]];

    vm.colors = [{ fillColor: '#e74c3c' }];

    vm.options = {
      scaleOverride: true,
      scaleStartValue: 0,
      scaleSteps: 0,
      scaleStepWidth: 1,
      scaleShowGridLines: false,
      scaleShowHorizontalLines: false,
      scaleShowVerticalLines: false,
      showScale: false,
      barShowStroke: false,
      barValueSpacing: 5,
      maintainAspectRatio: true,
    };

    httpRequest.get(dataUrl, params, (res) => {
      const data = [];
      for (let i = 0; i < $scope.labels.length; i++) {
        data.push(res.grades[$scope.labels[i]]);
      }

      $scope.data[0] = data;

      // Update scale start value and number of steps
      let minVal = data[0];
      let maxVal = data[0];
      for (let i = 0; i < data.length; i++) {
        if (data[i] < minVal) {
          minVal = data[i];
        }

        if (data[i] > maxVal) {
          maxVal = data[i];
        }
      }

      const minColHeight = Math.max(1, Math.round((maxVal - minVal) / 10));
      $scope.options.scaleStartValue = (minVal <= minColHeight) ? 0 : minVal - minColHeight;
      $scope.options.scaleSteps = (maxVal - minVal) + minColHeight;
    });
  },
  ]);
