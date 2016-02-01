'use strict';

angular
    .module('kramster', [
        'ngRoute',
        'ui.bootstrap',
        'ngSanitize',
        'chart.js'
    ])
    .config(['ChartJsProvider', function (ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions({
            colours: ['#FF5252', '#FF8A80'],
            responsive: true
        });
    }])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/about', {
                templateUrl: 'views/about.html'
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
