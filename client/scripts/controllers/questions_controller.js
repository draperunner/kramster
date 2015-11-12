'use strict';

angular.module('kramster')
    .controller('QuestionsController', ['$scope', '$rootScope', 'Helpers', 'httpRequest', '$route', '$routeParams', 'apiUrl', function ($scope, $rootScope, helpers, httpRequest, $route, $routeParams, apiUrl) {

        /* Different modes for the quizzing. */
        var mode = {
            /* String representing the doc fetch mode. 'all' if All button is clicked. 'random30' if 30 Random is clicked, etc. */
            docMode: $route.current.locals.mode,

            /* If set to true, the correct answer will be shown after answering, before next question appears. */
            showCorrectAnswerMode: true
        };

        /* Route parameters. */
        $scope.route = {
            school: $routeParams.school,
            course: $routeParams.course,
            document: $routeParams.document
        };

        var app = this;
        app.questions = [];

        /* History of answers. Boolean array. True for correct answer. */
        app.history = [];

        /* Total number of answers */
        app.numAnswered = function () {
            return app.history.length;
        };

        /* Total number of correct answers */
        app.numCorrects = function () {
            return app.history.filter(function (e) {
                return e
            }).length;
        };

        /* True if an answer is selected. */
        var answerGiven = false;

        /* Returns the current question */
        $scope.currentQuestion = function () {
            if (app.questions.length <= 0) {
                return {question: '', options: []};
            }
            if (mode.showCorrectAnswerMode && answerGiven) {
                return app.questions[app.history.length - 1];
            }
            return app.questions[app.history.length];
        };

        app.buttonClass = function (option) {
            if (!answerGiven || !mode.showCorrectAnswerMode) {
                return 'btn-default';
            }
            var previousQuestion = app.questions[app.history.length - 1];
            /* Check if the option the button represents is one of the correct answers. */
            if (previousQuestion.answers.indexOf(previousQuestion.options.indexOf(option)) >= 0) {
                return 'btn-success';
            }
            return 'btn-danger';
        };

        /* Is called when the user selects an answer */
        app.answer = function (answer) {
            if (!answerGiven && mode.showCorrectAnswerMode || !mode.showCorrectAnswerMode) {
                var q = $scope.currentQuestion();
                app.history.push(q && q.answers.indexOf(q.options.indexOf(answer)) >= 0);
                answerGiven = true;
            }
            else {
                answerGiven = false;
            }
        };

        /* Variables concerning the answering statistics for this session. */
        app.stats = {

            /* Get the (current) ratio of correct answers per total number of answered questions. */
            percentage: function () {
                return (app.numAnswered() > 0) ? Math.round(10000 * app.numCorrects() / app.numAnswered()) / 100 : 0;
            },

            /* Returns a status message. Example: "3/5 (60%)" */
            status: function () {
                return '' + app.numCorrects() + '/' + app.numAnswered() + ' (' + app.stats.percentage() + '%)';
            },

            /* Returns the grade corresponding to the current percentage. Uses the NTNU scale. */
            grade: function () {
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
            value: function () {
                if (app.questions.length > 0) {
                    return Math.floor(10000 / app.questions.length) / 100;
                }
            },
            type: function (index) {
                return (app.history[index]) ? 'success' : 'danger';
            }
        };

        /* ALL MODE.
         * Fetches all documents, gathers all questions from all of them, shuffles.
         */
        if (mode.docMode === 'all') {
            httpRequest.getAll(apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course, function (questions, meta) {
                app.questions = questions;
                mode.showCorrectAnswerMode = meta.mode === 'MC' || meta.mode === undefined;
            });
        }

        /* RANDOM N MODE.
         * Fetches n random questions from the course.
         */
        else if (mode.docMode === 'random') {
            var url = apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course + '/random/' + $routeParams.number;
            httpRequest.get(url, function (questions, meta) {
                app.questions = questions;
                mode.showCorrectAnswerMode = true;
            });
        }

        /* NON-RANDOM MODE.
         * Fetches the selected document and shuffles its questions.
         */
        else {
            httpRequest.getSelected(apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course + '/' + $routeParams.document, function (document) {
                app.questions = document.questions;
                helpers.shuffle(document.questions);
                mode.showCorrectAnswerMode = document.mode === 'MC' || document.mode === undefined;
            });
        }
    }]);
