'use strict';

angular.module('kramster')
    .controller('QuestionsController', ['$scope', '$location', 'Helpers', 'httpRequest', '$route', '$routeParams', 'apiUrl', 'deviceDetector',
        function ($scope, $location, helpers, httpRequest, $route, $routeParams, apiUrl, deviceDetector) {

        // Route parameters.
        $scope.route = {
            school: $routeParams.school,
            course: $routeParams.course,
            document: $routeParams.document
        };

        $scope.reloadRoute = function () {
            $route.reload();
        };

        // A: green, B: blue, C: purple, D: yellow, E: orange, F: red
        $scope.colors = { A: 'green', B: 'blue', C: 'purple', D: 'yellow', E: 'orange', F: 'red',
            fromUser: function () {
                return $scope.colors[app.stats.grade()];
            },
            fromServer: function () {
                return $scope.colors[app.stats.fromServer && app.stats.fromServer.averageGrade || 'B'];
            }
        };

        // Different modes for the quizzing.
        $scope.mode = {
            // String representing the doc fetch mode. 'all' if All button is clicked. 'random' if Random X is clicked, etc.
            docMode: $route.current.locals.mode,
            // If set to true, the correct answer will be shown after answering, before next question appears.
            showCorrectAnswerMode: true
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

        const emptyQuestion = {question: '', options: []};

        // Returns the current question
        $scope.currentQuestion = function() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            // If questions still are being fetched, return an empty question.

            if (app.questions.length <= 0) {
                return emptyQuestion;
            }
            if ($scope.mode.showCorrectAnswerMode && answerGiven) {
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
                        documentName: ($scope.mode.docMode) ? $scope.mode.docMode : $scope.route.document.replace(/_/g, " ")
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
                    app.stats.fromServer.averageScore = stats.averageScore.toFixed(2);
                    app.stats.fromServer.averageGrade = helpers.percentageToGrade(app.stats.percentage(stats.totalScore, stats.numReports * report.numQuestions));
                    app.stats.fromServer.percentage = app.stats.percentage(stats.totalScore, stats.numReports * report.numQuestions);
                });
            }
            return true;
        };

        // Returns the class (color, mostly) of the option button decided by if it's the right answer or not.
        app.buttonClass = function(option) {
            if (!answerGiven || !$scope.mode.showCorrectAnswerMode) {
                return deviceDetector.isMobile() ? 'btn-question-mobile' : 'btn-question';
            }
            var previousQuestion = app.questions[app.history.length - 1];
            // Check if the option the button represents is one of the correct answers.
            if (previousQuestion.answers.indexOf(previousQuestion.options.indexOf(option)) >= 0) {
                return 'btn-correct-answer';
            }
            return 'btn-wrong-answer';
        };

        // Is called when the user selects an answer.
        app.answer = function(answer) {
            if (!answerGiven && $scope.mode.showCorrectAnswerMode || !$scope.mode.showCorrectAnswerMode) {
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
            percentage: function(dividend, divisor) {
                if (!dividend && !divisor) {
                    return (app.numAnswered() > 0) ? Math.round(10000 * app.numCorrects() / app.numAnswered()) / 100 : 0;
                }
                else if (dividend && divisor) {
                    return (divisor > 0) ? Math.round(10000 * dividend / divisor) / 100 : 0;
                }
            },

            // Returns a score status message. Example: "3 (60%)"
            status: function(score) {
                if (!score) {
                    return '' + app.numCorrects() + ' (' + app.stats.percentage() + '%)';
                }
                return '' + score.toFixed(2) + ' (' + app.stats.percentage(score, app.questions.length) + '%)';
            },

            // Returns the grade corresponding to the current percentage. Uses the NTNU scale.
            grade: function () {
                return helpers.percentageToGrade(app.stats.percentage());
            },

            // Number of correct answers
            score: function () {
                return app.numCorrects();
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
                return (app.history[index]) ? 'correct' : 'wrong';
            }
        };

        var url = apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course;

        // ALL MODE. Fetches all documents, gathers all questions from all of them, shuffles.
        if ($scope.mode.docMode === 'all') {
            httpRequest.getAll(url, function(questions, meta) {
                app.questions = questions;
                $scope.mode.showCorrectAnswerMode = meta.mode === 'MC' || meta.mode === undefined;
            });
        }

        // RANDOM N MODE. Fetches n random questions from the course.
        else if ($scope.mode.docMode === 'random') {
            url += '/random/' + $routeParams.number;
            httpRequest.get(url, function(questions, meta) {
                app.questions = questions;
                $scope.mode.showCorrectAnswerMode = true;
            });
        }

        // NON-RANDOM MODE. Fetches the selected document and shuffles its questions.
        else {
            url += '/' + $routeParams.document;
            httpRequest.getSelected(url, function (document) {
                app.questions = document.questions;
                helpers.shuffle(document.questions);
                $scope.mode.showCorrectAnswerMode = document.mode === 'MC' || document.mode === undefined;
            });
        }
    }]);
