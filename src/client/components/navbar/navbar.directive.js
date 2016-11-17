angular.module('kramster')
    .directive('navbar', () => {
      const controller = ['$scope', '$location', function navbarController($scope, $location) {
        $scope.onRootLocation = () => $location.url() === '/';
      }];

      return {
        restrict: 'E',
        templateUrl: '/components/navbar/navbar.html',
        controller,
      };
    });
