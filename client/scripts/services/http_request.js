'use strict';

/*
 * Methods for communicating with API.
 */

angular.module('kramster')
	.service('httpRequest', ['$http', '$rootScope', 'Helpers', function($http, $rootScope, helpers) {

		/* Gets an array and forwards it to callback function. If order is given, sort data in that order. */
		this.get = function(url, callback) {
			$http.get(url).
				success(function(data) {
					callback(data);
				});
		};

		/* Gets the shuffled questions from selected document and passes on to callback. */
		this.getSelected = function(url, callback) {
			$rootScope.loading = true;
			$http.get(url)
				.success(function(data) {
					$rootScope.loading = false;
					callback(data);
			});
		};

		/* Gets all shuffled questions of all documents of given url and passes to callback. Can be limited by parameter 'limit'. If limit not set, gets all. */
		this.getAll = function(url, callback, limit) {
			$rootScope.loading = true;
			$http.get(url)
				.success(function(data) {
					$rootScope.loading = false;
					var allQuestions = [];
					for (var i=0; i < data.length; i++) {
						allQuestions.push.apply(allQuestions, data[i].questions);
					}
					helpers.shuffle(allQuestions);
					callback(allQuestions.slice(0, typeof limit !== 'undefined' ? limit : allQuestions.length));
				});
		};

	}
]);
