/*
 * Methods for communicating with API.
 */
angular.module('kramster')
    .factory('httpRequest', ['$http', '$rootScope',
      function httpRequest($http, $rootScope) {
        return {

        // Gets an array and forwards it to callback function.
          get(url, params, callback) {
            $http.get(url, { params }).then((res) => {
              callback(res.data);
            });
          },

        // Gets n random questions
          getRandom(url, n, callback) {
            const params = {
              random: 'true',
              limit: n,
            };

            $rootScope.loading = true;
            $http.get(url, { params }).then((res) => {
              $rootScope.loading = false;
              callback(res.data);
            });
          },

        // Gets the selected exam(s) and passes on to callback.
          getSelected(url, params, callback) {
            $rootScope.loading = true;
            $http.get(url).then((res) => {
              $rootScope.loading = false;
              callback(res.data[0]);
            });
          },

        // Gets all questions of all exams of given url and passes to callback.
          getAll(url, callback) {
            $rootScope.loading = true;
            $http.get(url).then((res) => {
              $rootScope.loading = false;
              const allQuestions = [];
              for (let i = 0; i < res.data.length; i++) {
                allQuestions.push(...res.data[i].questions);
              }

              callback(allQuestions);
            });
          },

        // General http POST
          post(url, data, callback) {
            $http.post(url, data).then((res) => {
              callback(res.data);
            });
          },
        };
      },
    ]);
