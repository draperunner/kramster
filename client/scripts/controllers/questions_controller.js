'use strict';

angular.module('kramster')
	.controller('QuestionsController', ['$scope', 'Helpers', '$route', '$http', '$routeParams', 'apiUrl', function($scope, helpers, $route, $http, $routeParams, apiUrl) {

	/* Random mode is when the user clicks the button "30 Random" or similar. The controller has to fetch from all documents. */
	var randomMode = $route.current.locals.random;

	var app = this;
	app.questions = [];

	/* History of answers. Boolean array. True for correct answer. */
	app.history = [];

	/* Total number of answers */
	app.numAnswered = function() {
		return app.history.length;
	};

	/* Total number of correct answers */
	app.numCorrects = function() {
		return app.history.filter(function(e) {return e}).length;
	};

	/* Route parameters. */
	$scope.route = {
	  school: $routeParams.school,
	  course: $routeParams.course,
	  doc: (randomMode) ? 'random30' : $routeParams.document
	};

	/* Returns the current question */
	$scope.currentQuestion = function() {
	  return (app.questions.length > 0) ? app.questions[app.history.length] : {question: '', options: []};
	};

	/* Is called when the user selects an answer */
	app.answer = function(answer) {
		var q = $scope.currentQuestion();
		app.history.push(q && q.options.indexOf(answer) === q.answer);
	};

	/* Variables concerning the answering statistics for this session. */
	app.stats = {

	  /* Get the (current) ratio of correct answers per total number of answered questions. */
	  percentage: function() {
		return (app.numAnswered() > 0) ? Math.round(10000 * app.numCorrects() / app.numAnswered()) / 100 : 0;
	  },

	  /* Returns a status message. Example: "3/5 (60%)" */
	  status: function() {
		return '' + app.numCorrects() + '/' + app.numAnswered() + ' (' + app.stats.percentage() + '%)';
	  },

	  /* Returns the grade corresponding to the current percentage. Uses the NTNU scale. */
	  grade: function() {
			var scale = [89, 77, 65, 53, 41];
			var grades = ['A', 'B', 'C', 'D', 'E'];

			for (var i = 0; i < scale.length; i++) {
				if (app.stats.percentage() >= scale[i]) {
					return grades[i];
				}
			}
			return 'F';
		}
	};

	/* Variables used for the progress bar. */
	app.progress = {
		value: function() {
			if (app.questions.length > 0) {
				return Math.floor(10000 / app.questions.length) / 100;
			}
		},
		type: function(index) {
			return (app.history[index]) ? 'success' : 'danger';
		}
	};

	/* RANDOM MODE.
	 * Fetches all documents, gathers all questions from all of them, shuffles, then takes the first 30.
	 */
	if (randomMode) {
	  $http.get(apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course)
			.success(function(data) {
				var allQuestions = [];
				for (var i=0; i < data.length; i++) {
					allQuestions.push.apply(allQuestions, data[i].questions);
				}
				helpers.shuffle(allQuestions);
				app.questions = allQuestions.slice(0, 30);
			});
	}

	/* NON-RANDOM MODE.
	 * Fetches the selected document and shuffles its questions.
	 */
	else {
	  $http.get(apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course + '/' + $routeParams.document)
			.success(function(data) {
				helpers.shuffle(data.questions);
				app.questions = data.questions;
			});
	}


  }]);
