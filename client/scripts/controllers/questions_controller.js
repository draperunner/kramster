'use strict';

angular.module('kramster')
  .controller('QuestionsController', ['$scope', '$route', '$http', '$routeParams', 'apiUrl', function($scope, $route, $http, $routeParams, apiUrl) {

    var randomMode = $route.current.locals.random;

    var app = this;
    app.questions = [];

      app.route = {
      school: $routeParams.school,
      course: $routeParams.course,
      doc: (randomMode) ? 'random30' : $routeParams.document
    };

    app.questionIndex = 0;

    app.stats = {
      numCorrects: 0,
      numAnswered: 0,
      numAnsweredArray: function() {
        return new Array(app.stats.numAnswered);
      },
      percentage: function() {
        return (app.stats.numAnswered > 0) ? Math.round(10000 * app.stats.numCorrects / app.stats.numAnswered) / 100 : 0;
      },
      string: function() {
        return '' + app.stats.numCorrects + '/' + app.stats.numAnswered + ' (' + app.stats.percentage() + '%)';
      },
      scale : [89, 77, 65, 53, 41],
      grades: ['A', 'B', 'C', 'D', 'E'],
      grade: function() {
        for (var i = 0; i < app.stats.scale.length; i++) {
          if (app.stats.percentage() >= app.stats.scale[i]) { return app.stats.grades[i]; }
        }
        return 'F';
      },

      progress: {
        history: [],
        value: function() {
          if (app.questions.length > 0) {
            return Math.floor(10000 / app.questions.length) / 100;
          }
        },
        type: function(index) {
          return (app.stats.progress.history[index]) ? 'success' : 'danger';
        }
      }
    };

    if (randomMode) {
      $http.get(apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course).
        success(function(data) {
          var allQuestions = [];
          for (var i=0; i < data.length; i++) {
            allQuestions.push.apply(allQuestions, data[i].questions);
          }
          app.shuffleQuestions(allQuestions);
          app.questions = allQuestions.slice(0, 30);
        });
    }
    else {
      $http.get(apiUrl + 'documents/' + $routeParams.school + '/' + $routeParams.course + '/' + $routeParams.document).
        success(function(data) {
          app.shuffleQuestions(data.questions);
          app.questions = data.questions;
        });
    }

    this.currentQuestion = function() {
      return (this.questions.length > 0) ? this.questions[this.questionIndex] : {queston: '', options: []};
    };

    this.answer = function(answer) {
      if (this.currentQuestion() && this.currentQuestion().options.indexOf(answer) === this.currentQuestion().answer) {
        this.stats.progress.history.push(true);
        this.stats.numCorrects++;
      }
      else {
        this.stats.progress.history.push(false);
      }
      this.stats.numAnswered++;
      this.questionIndex++;
    };

    this.shuffleQuestions = function(questions) {
      var size = questions.length;
      for (var i=0; i < size; i++) {
        var j = Math.round(i + (size - 1 - i) * Math.random());
        var temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
      }
      return questions;
    };

  }]);
