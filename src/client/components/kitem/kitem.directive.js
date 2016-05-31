'use strict';

// The buttons you see most of on Kramster

angular.module('kramster')
    .directive('kitem', ['deviceDetector', function (deviceDetector) {

      return {
        restrict: 'E',
        scope: {
          head: '@',
          body: '@',
          color: '@',
          minHeight: '@',
          clickable: '&',
        },
        templateUrl: '/components/kitem/kitem.html',
        link: function (scope, elem, attr) {

          var mobile = deviceDetector.isMobile();

          scope.role = (!attr.hasOwnProperty('clickable') || attr.clickable !== 'false')
            ? 'button' : '';

          if (attr.color && elem[0].firstChild.className.indexOf('kitem-' + attr.color) < 0) {
            elem[0].firstChild.className = elem[0].firstChild.className + ' kitem-' + attr.color;
          }

          if (attr.minHeight && !mobile
            && elem[0].firstChild.className.indexOf('kitem-min-height') < 0) {
            elem[0].firstChild.className = elem[0].firstChild.className + ' kitem-min-height';
          }

          if (mobile || attr.hasOwnProperty('clickable') && attr.clickable === 'false') {
            var className = elem[0].firstChild.className;
            elem[0].firstChild.className = className.replace('kitem-clickable', '');
          }

          attr.$observe('color', function () {
            elem[0].firstChild.className = elem[0].firstChild.className + ' kitem-' + attr.color;
          });

          attr.$observe('role', function () {
            scope.role = (attr.hasOwnProperty('clickable') || attr.clickable) ? 'button' : '';
          });
        },
      };
    },
    ]);
