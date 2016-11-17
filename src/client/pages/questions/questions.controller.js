

angular.module('kramster')
  .controller('QuestionsController',
  ['$scope', '$location', '$document', 'httpRequest', '$route', '$routeParams', 'apiUrl', 'deviceDetector', 'Helpers',
    function QCtrl($scope, $location, $document, httpRequest, $route, $routeParams, apiUrl, deviceDetector, Helpers) {
      const vm = this;
      // Route parameters.
      vm.route = {
        school: $routeParams.school,
        course: $routeParams.course,
        exam: $routeParams.exam,
      };

      vm.reloadRoute = () => {
        $route.reload();
      };

      // A: green, B: blue, C: purple, D: yellow, E: orange, F: red
      vm.colors = {
        A: 'green',
        B: 'blue',
        C: 'purple',
        D: 'yellow',
        E: 'orange',
        F: 'red',
        fromUser() {
          return $scope.colors[vm.stats.grade()];
        },

        fromServer() {
          return $scope.colors[(vm.stats.fromServer && vm.stats.fromServer.averageGrade) || 'B'];
        },
      };

      // Different modes for the quizzing.
      vm.mode = {
        // String representing the doc fetch mode.
        // 'all' if All button is clicked. 'random' if Random X is clicked, etc.
        docMode: $route.current.locals.mode,
      };

      vm.questions = [];

      // History of answers. Boolean array. True for correct answer.
      vm.history = [];

      // Total number of answers.
      vm.numAnswered = () => vm.history.length;

      // Total number of correct answers.
      vm.numCorrects = () => vm.history.filter(e => e).length;

      // True if an answer is selected.
      let answerGiven = false;

      const emptyQuestion = { question: '', options: [] };

      // Returns the current question
      vm.currentQuestion = () => {
        let question;

        // If questions still are being fetched, return an empty question.
        if (vm.questions.length <= 0) {
          question = emptyQuestion;
        }
        else if (answerGiven) {
          question = vm.questions[vm.history.length - 1];
        }
        else {
          question = vm.questions[vm.history.length];
        }

        // Render math
        const domElementsThatMightContainMath = $document.getElementsByClassName('math');
        for (let i = 0; i < domElementsThatMightContainMath.length; i++) {
          renderMathInElement(domElementsThatMightContainMath[i]);
        }

        return question;
      };

      vm.numberOfQuestions = () => vm.questions.length;

      // Returns the class (color, mostly) of the option button
      // decided by if it's the right answer or not.
      vm.buttonClass = (option) => {
        if (!answerGiven) {
          return deviceDetector.isMobile() ? 'btn-question-mobile' : 'btn-question';
        }

        const previousQuestion = vm.questions[vm.history.length - 1];

        // Check if the option the button represents is one of the correct answers.
        if (previousQuestion.answers.indexOf(previousQuestion.options.indexOf(option)) >= 0) {
          return 'btn-correct-answer';
        }

        return 'btn-wrong-answer';
      };

      // Prevents multiples of the same report being sent to server.
      let finishedReturnedTrue = false;

      // Checks if exam is finished. Reports stats to server if true.
      // Fetches aggregated stats from server.
      vm.finished = () => {
        if ($scope.currentQuestion()) {
          return false;
        }

        if (!finishedReturnedTrue) {
          finishedReturnedTrue = true;
          const report = {
            exam: {
              school: $routeParams.school,
              course: $routeParams.course,
              name: ($scope.mode.docMode) ? $scope.mode.docMode : $scope.route.exam,
            },
            createdAt: Helpers.getLocalTime(),
            score: vm.numCorrects(),
            numQuestions: vm.questions.length,
            percentage: vm.stats.percentage(),
            grade: vm.stats.grade(),
          };
          httpRequest.post(`${apiUrl}reports/add`, report, () => {
            // Fetch aggregated statistics from server
            const url = `${apiUrl}stats/${$routeParams.school
               }/${$routeParams.course}/${report.exam.name}`;

            const params = {};
            if (report.exam.name === 'random') {
              params.numQuestions = vm.questions.length;
            }

            httpRequest.get(url, params, (stats) => {
              const totalNumberOfQuestions = stats.numReports * report.numQuestions;
              const avgPercentage = vm.stats.percentage(stats.totalScore, totalNumberOfQuestions);
              vm.stats.fromServer = stats;
              vm.stats.fromServer.averageScore = stats.averageScore.toFixed(2);
              vm.stats.fromServer.averageGrade = Helpers.percentageToGrade(avgPercentage);
              vm.stats.fromServer.percentage = avgPercentage;
            });
          });
        }

        return true;
      };

      // Is called when the user selects an answer.
      vm.answer = (answer) => {
        if (!answerGiven) {
          const q = vm.currentQuestion();
          vm.history.push(q && q.answers.indexOf(q.options.indexOf(answer)) >= 0);
        }

        answerGiven = !answerGiven;
      };

      // Variables concerning the answering statistics for this session.
      vm.stats = {
        // Get the (current) ratio of correct answers per total number of answered questions.
        percentage(dividend, divisor) {
          if (!dividend && !divisor) {
            return (vm.numAnswered() > 0)
              ? Math.round((10000 * vm.numCorrects()) / vm.numAnswered()) / 100 : 0;
          }
          else if (dividend && divisor) {
            return (divisor > 0) ? Math.round((10000 * dividend) / divisor) / 100 : 0;
          }
          return 0;
        },

        // Returns a score status message. Example: "3 (60%)"
        status(score) {
          if (!score) {
            return `${vm.numCorrects()} (${vm.stats.percentage()}%)`;
          }

          return `${score.toFixed(2)
             } (${vm.stats.percentage(score, vm.questions.length)}%)`;
        },

        // Returns the grade corresponding to the current percentage. Uses the NTNU scale.
        grade() {
          return Helpers.percentageToGrade(vm.stats.percentage());
        },

        // Number of correct answers
        score() {
          return vm.numCorrects();
        },
      };

      // Variables used for the progress bar.
      vm.progress = {
        value() {
          return (vm.questions.length > 0) ? Math.floor(10000 / vm.questions.length) / 100 : 0;
        },

        type(index) {
          return (vm.history[index]) ? 'correct' : 'wrong';
        },
      };

      let url = `${apiUrl}exams/${$routeParams.school}/${$routeParams.course}`;

      // ALL MODE. Fetches all exams, gathers all questions from all of them, shuffles.
      if ($scope.mode.docMode === 'all') {
        httpRequest.getAll(url, (questions) => {
          vm.questions = questions;
        });
      }

      // RANDOM N MODE. Fetches n random questions from the course.
      else if ($scope.mode.docMode === 'random') {
        httpRequest.getRandom(url, $routeParams.number, (questions) => {
          vm.questions = questions;
        });
      }

      // NON-RANDOM MODE. Fetches the selected exam and shuffles its questions.
      else {
        url += `/${$routeParams.exam}`;
        httpRequest.getSelected(url, {}, (exam) => {
          vm.questions = exam.questions;
        });
      }
    },
  ]);
