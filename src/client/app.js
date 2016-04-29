'use strict';

angular
  .module('kramster', [
      'ngRoute',
      'ngSanitize',
      'chart.js',
      'ng.deviceDetector',
  ])
  .run(function ($rootScope, $window, $location) {
    $rootScope.goExternal = function (path) {
      $window.location.href = path;
    };

    $rootScope.go = function (path) {
      $location.path(path);
    };
  })
  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      // A: green, B: blue, C: purple, D: yellow, E: orange, F: red
      colours: ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'],
      responsive: true,
    });
  },
  ])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/about', {
        templateUrl: 'views/about.html',
      }).
      when('/', {
        templateUrl: 'views/schools-list.html',
        controller: 'SchoolListController',
        controllerAs: 'schoolsCtrl',
      }).
      when('/:school', {
        templateUrl: 'views/courses-list.html',
        controller: 'CourseListController',
        controllerAs: 'coursesCtrl',
      }).
      when('/:school/:course', {
        templateUrl: 'views/exams-list.html',
        controller: 'ExamListController',
        controllerAs: 'examsCtrl',
      }).
      when('/:school/:course/random/:number', {
        templateUrl: 'views/questions-list.html',
        controller: 'QuestionsController',
        controllerAs: 'questionsCtrl',
        resolve: {
          mode: function () {
            return 'random';
          },
        },
      }).
      when('/:school/:course/all', {
        templateUrl: 'views/questions-list.html',
        controller: 'QuestionsController',
        controllerAs: 'questionsCtrl',
        resolve: {
          mode: function () {
            return 'all';
          },
        },
      }).
      when('/:school/:course/:exam', {
        templateUrl: 'views/questions-list.html',
        controller: 'QuestionsController',
        controllerAs: 'questionsCtrl',
      });

    $locationProvider.html5Mode(true);
  },
  ])
  .value('apiUrl', '/api/');
