'use strict';

angular.module('kramster')
    .controller('QuestionsController', ['$scope', 'Helpers', 'httpRequest', '$route', '$routeParams', 'apiUrl', function ($scope, helpers, httpRequest, $route, $routeParams, apiUrl) {

        // Different modes for the quizzing.
        var mode = {
            // String representing the doc fetch mode. 'all' if All button is clicked. 'random' if Random X is clicked, etc.
            docMode: $route.current.locals.mode,
            // If set to true, the correct answer will be shown after answering, before next question appears.
            showCorrectAnswerMode: true
        };

        // Route parameters.
        $scope.route = {
            school: $routeParams.school,
            course: $routeParams.course,
            document: $routeParams.document
        };

        var app = this;
        app.questions = [];

        // History of answers. Boolean array. True for correct answer.
        app.history = [];

        // Total number of answers.
        app.numAnswered = function () {
            return app.history.length;
        };

        // Total number of correct answers.
        app.numCorrects = function() {
            return app.history.filter(function(e) { return e; }).length;
        };

        // True if an answer is selected.
        var answerGiven = false;

        // Returns the current question
        $scope.currentQuestion = function() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            // If questions still are being fetched, return an empty question.
            if (app.questions.length <= 0) {
                return {question: '', options: []};
            }
            if (mode.showCorrectAnswerMode && answerGiven) {
                return app.questions[app.history.length - 1];
            }
            return app.questions[app.history.length];
        };


        // Prevents multiples of the same report being sent to server.
        var finishedReturnedTrue = false;

        // Checks if exam is finished. Reports stats to server if true. Fetches aggregated stats from server.
        $scope.finished = function() {
            if ($scope.currentQuestion()) { return false; }
            if (!finishedReturnedTrue) {
                var report = {
                    document: {
                        school: $routeParams.school.replace(/_/g, " "),
                        course: $routeParams.course.replace(/_/g, " "),
                        documentName: (mode.docMode) ? mode.docMode : $scope.route.document.replace(/_/g, " ")
                    },
                    score: app.numCorrects(),
                    numQuestions: app.questions.length,
                    percentage: app.stats.percentage(),
                    grade: app.stats.grade()
                };
                httpRequest.post(apiUrl + 'reports/add', report);
                finishedReturnedTrue = true;

                // Fetch aggregated statistics from server
                var url = apiUrl + 'stats/' + $routeParams.school + '/' + $routeParams.course + '/' + report.document.documentName.replace(' ', '_');
                httpRequest.get(url, function(stats) {
                    app.stats.fromServer = stats;
                    app.stats.fromServer.averageGrade = helpers.percentageToGrade(100 * stats.totalScore / report.numQuestions);
                });
            }
            return true;
        };

        // Returns the class (color, mostly) of the option button decided by if it's the right answer or not.
        app.buttonClass = function(option) {
            if (!answerGiven || !mode.showCorrectAnswerMode) {
                return 'btn-default';
            }
            var previousQuestion = app.questions[app.history.length - 1];
            // Check if the option the button represents is one of the correct answers.
            if (previousQuestion.answers.indexOf(previousQuestion.options.indexOf(option)) >= 0) {
                return 'btn-success';
            }
            return 'btn-danger';
        };

        // Is called when the user selects an answer.
        app.answer = function(answer) {
            if (!answerGiven && mode.showCorrectAnswerMode || !mode.showCorrectAnswerMode) {
                var q = $scope.currentQuestion();
                app.history.push(q && q.answers.indexOf(q.options.indexOf(answer)) >= 0);
                answerGiven = true;
            }
            else {
                answerGiven = false;
            }
        };

        // Variables concerning the answering statistics for this session.
        app.stats = {
            // Get the (current) ratio of correct answers per total number of answered questions.
            percentage: function() {
                return (app.numAnswered() > 0) ? Math.round(10000 * app.numCorrects() / app.numAnswered()) / 100 : 0;
            },

            // Returns a status message. Example: "3/5 (60%)"
            status: function() {
                return '' + app.numCorrects() + '/' + app.numAnswered() + ' (' + app.stats.percentage() + '%)';
            },

            // Returns the grade corresponding to the current percentage. Uses the NTNU scale.
            grade: function() {
                return helpers.percentageToGrade(app.stats.percentage());
            }
        };

        // Variables used for the progress bar.
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

        // ALL MODE. Fetches all documents, gathers all questions from all of them, shuffles.
        if (mode.docMode === 'all') {
            var url = apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course;
            httpRequest.getAll(url, function(questions, meta) {
                app.questions = questions;
                mode.showCorrectAnswerMode = meta.mode === 'MC' || meta.mode === undefined;
            });
        }

        // RANDOM N MODE. Fetches n random questions from the course.
        else if (mode.docMode === 'random') {
            var url = apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course + '/random/' + $routeParams.number;
            httpRequest.get(url, function(questions, meta) {
                app.questions = questions;
                mode.showCorrectAnswerMode = true;
            });
        }

        // NON-RANDOM MODE. Fetches the selected document and shuffles its questions.
        else {
            var url = apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course + '/' + $routeParams.document;
            httpRequest.getSelected(url, function (document) {
                app.questions = document.questions;
                helpers.shuffle(document.questions);
                mode.showCorrectAnswerMode = document.mode === 'MC' || document.mode === undefined;
            });
        }
    }]);
