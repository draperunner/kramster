'use strict';

/*
 * Methods for communicating with API.
 */

angular.module('kramster')
    .service('httpRequest', ['$http', '$rootScope', 'Helpers', function($http, $rootScope, helpers) {

        // Gets an array and forwards it to callback function. If order is given, sort data in that order.
        this.get = function(url, callback) {
            $http.get(url).then(function(res) {
                callback(res.data);
            });
        };

        // Gets the selected document and passes on to callback.
        this.getSelected = function(url, callback) {
            $rootScope.loading = true;
            $http.get(url).then(function(res) {
                $rootScope.loading = false;
                callback(res.data);
            });
        };

        // Gets all questions of all documents of given url and passes to callback. Passes also a meta object.
        this.getAll = function(url, callback) {
            $rootScope.loading = true;
            $http.get(url).then(function(res) {
                $rootScope.loading = false;
                var allQuestions = [];
                for (var i = 0; i < res.data.length; i++) {
                    allQuestions.push.apply(allQuestions, res.data[i].questions);
                }

                var uniqueModes = helpers.removeDuplicates(res.data.map(function(doc) {return doc.mode}));

                var meta = {
                    mode: (uniqueModes.length === 1) ? uniqueModes[0] : 'MC'
                };
                callback(allQuestions, meta);
            });
        };

        // General http POST
        this.post = function(url, data) {
            $http.post(url, data);
        }
    }
]);
