angular.module('kramster')
  .controller('CourseListController',
  ['$scope', '$location', 'httpRequest', '$routeParams', 'apiUrl',
    function CourseListController($scope, $location, httpRequest, $routeParams, apiUrl) {
      const vm = this;
      // Returns a pretty header for the course (the course code)
      vm.header = course => course.split(' ')[0].toUpperCase();

      // Returns the full name of the course. Removes course code
      vm.name = course => course.replace(course.split(' ')[0], '').trim();

      vm.courses = [];
      vm.school = $routeParams.school;

      httpRequest.get(`${apiUrl}list/courses/${$routeParams.school}`, {}, (data) => {
        vm.courses = data;
      });
    },
  ]);
