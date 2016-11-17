angular.module('kramster')
    .directive('jumbotron', () => {
      const controller = ['$scope', function jumbotronController($scope) {
        const subtitles = [
          'Will you improve the statistics?',
          'Where are you on the chart?',
          "It's OK to fail.",
          'Practice makes perfect.',
          "You'll do great!",
          "Remember, grades aren't everything.",
          'Cram with Kramster!',
        ];

        let picked = '';

        $scope.subtitle = () => {
          picked = picked || subtitles[Math.floor(Math.random() * subtitles.length)];
          return picked;
        };
      },
      ];

      return {
        restrict: 'E',
        templateUrl: '/components/jumbotron/jumbotron.html',
        controller,
      };
    });
