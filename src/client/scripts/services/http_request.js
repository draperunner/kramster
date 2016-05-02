'use strict';

/*
 * Methods for communicating with API.
 */

angular.module('kramster')
    .service('httpRequest', ['$http', '$rootScope', 'Helpers',
      function ($http, $rootScope, helpers) {

        // Gets an array and forwards it to callback function.
        this.get = function (url, params, callback) {
          $http.get(url, { params: params }).then(function (res) {
            callback(res.data);
          });
        };

        // Gets n random questions
        this.getRandom = function (url, n, callback) {
          var params = {
            random: 'true',
            limit: n,
          };

          $rootScope.loading = true;
          $http.get(url, { params: params }).then(function (res) {
            $rootScope.loading = false;
            callback(res.data);
          });
        };

        // Gets the selected exam(s) and passes on to callback.
        this.getSelected = function (url, params, callback) {
          $rootScope.loading = true;
          $http.get(url).then(function (res) {
            $rootScope.loading = false;
            callback(res.data[0]);
          });
        };

        // Gets all questions of all exams of given url and passes to callback.
        this.getAll = function (url, callback) {
          $rootScope.loading = true;
          $http.get(url).then(function (res) {
            $rootScope.loading = false;
            var allQuestions = [];
            for (var i = 0; i < res.data.length; i++) {
              allQuestions.push.apply(allQuestions, res.data[i].questions);
            }

            callback(allQuestions);
          });
        };

        // General http POST
        this.post = function (url, data, callback) {
            $http.post(url, data).then(function (res) {
              callback(res.data);
            });
          };
      },
]);
