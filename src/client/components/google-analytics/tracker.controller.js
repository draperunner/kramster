/* Google Analytics */
angular.module('kramster')
    .controller('TrackerController', ['$scope', '$location', '$window',
      function TrackerController($scope, $location, $window) {
        $scope.$on('$viewContentLoaded', () => {
          $window.ga('send', 'pageview', { page: $location.url() });
        });
      },
    ]);
