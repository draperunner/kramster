'use strict';

/**
 * @ngdoc overview
 * @name suckfaceApp
 * @description
 * # suckfaceApp
 *
 * Main module of the application.
 */
angular
  .module('kramster', [
    'ngRoute',
    'ui.bootstrap'
  ])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/about', {
        templateUrl: 'views/about.html'
      }).
      when('/theapi', {
        templateUrl: 'views/api.html'
      }).
      when('/contribute', {
        templateUrl: 'views/contribute.html'
      }).
      when('/', {
        templateUrl: 'views/schools-list.html',
        controller: 'SchoolListController',
        controllerAs: 'schoolsCtrl'
      }).
      when('/:school', {
        templateUrl: 'views/courses-list.html',
        controller: 'CourseListController',
        controllerAs: 'coursesCtrl'
      }).
      when('/:school/:course', {
        templateUrl: 'views/documents-list.html',
        controller: 'DocumentListController',
        controllerAs: 'documentsCtrl'
      }).
      when('/:school/:course/random30', {
        templateUrl: 'views/questions-list.html',
        controller: 'QuestionsController',
        controllerAs: 'questionsCtrl',
        resolve: {
          random: function() {return true;}
        }
      }).
      when('/:school/:course/:document', {
        templateUrl: 'views/questions-list.html',
        controller: 'QuestionsController',
        controllerAs: 'questionsCtrl'
      });

    $locationProvider.html5Mode(true);
  }])
    .value('apiUrl', 'http://localhost:5600/api/');
