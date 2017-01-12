

angular.module('kramster')
  .controller('ExamListController',
  ['$rootScope', '$scope', '$location', 'httpRequest', '$routeParams', 'apiUrl',
    function ExamListController($rootScope, $scope, $location, httpRequest, $routeParams, apiUrl) {
      const vm = this;
      $rootScope.loading = false;

      vm.route = {
        school: $routeParams.school,
        course: $routeParams.course,
      };

      vm.exams = [];

      const url = `${apiUrl}list/exams/${$routeParams.school}/${$routeParams.course}`;
      const query = { sort: '-alphabetically' };

      httpRequest.get(url, query, (data) => {
        vm.exams = data;
      });
    },
  ]);
