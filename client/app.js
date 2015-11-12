'use strict';

angular
    .module('kramster', [
        'ngRoute',
        'ui.bootstrap',
        'ngSanitize'
    ])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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
            when('/:school/:course/random/:number', {
                templateUrl: 'views/questions-list.html',
                controller: 'QuestionsController',
                controllerAs: 'questionsCtrl',
                resolve: {
                    mode: function () {
                        return 'random';
                    }
                }
            }).
            when('/:school/:course/all', {
                templateUrl: 'views/questions-list.html',
                controller: 'QuestionsController',
                controllerAs: 'questionsCtrl',
                resolve: {
                    mode: function () {
                        return 'all';
                    }
                }
            }).
            when('/:school/:course/:document', {
                templateUrl: 'views/questions-list.html',
                controller: 'QuestionsController',
                controllerAs: 'questionsCtrl'
            });

        $locationProvider.html5Mode(true);
    }])
    .value('apiUrl', 'http://localhost:8000/api/');
