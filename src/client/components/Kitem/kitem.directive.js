// The buttons you see most of on Kramster
angular.module('kramster')
    .directive('kitem', ['deviceDetector', function kitem(deviceDetector) {
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
        link(scope, elem, attr) {
          const mobile = deviceDetector.isMobile();

          scope.role = (!attr.clickable || attr.clickable !== 'false')
            ? 'button' : '';

          if (attr.color && elem[0].firstChild.className.indexOf(`kitem-${attr.color}`) < 0) {
            elem[0].firstChild.className = `${elem[0].firstChild.className} kitem-${attr.color}`;
          }

          if (attr.minHeight && !mobile
            && elem[0].firstChild.className.indexOf('kitem-min-height') < 0) {
            elem[0].firstChild.className = `${elem[0].firstChild.className} kitem-min-height`;
          }

          if (mobile || (attr.clickable && attr.clickable === 'false')) {
            const className = elem[0].firstChild.className;
            elem[0].firstChild.className = className.replace('kitem-clickable', '');
          }

          attr.$observe('color', () => {
            elem[0].firstChild.className = `${elem[0].firstChild.className} kitem-${attr.color}`;
          });

          attr.$observe('role', () => {
            scope.role = (attr.clickable || attr.clickable) ? 'button' : '';
          });
        },
      };
    },
    ]);
