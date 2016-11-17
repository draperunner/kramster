/**
 * @file Contains static helper methods.
 * @author Mats Byrkjeland
 */

angular.module('kramster')
    .factory('Helpers', () => ({

      /**
       * Returns the mapping from a percentage to grade.
       *
       * @param {Number} percentage - An exam result as the percentage of correct answers.
       * @returns {string} grade - A appropriate letter grade.
       */
      percentageToGrade(percentage) {
        const scale = [89, 77, 65, 53, 41];
        const grades = ['A', 'B', 'C', 'D', 'E'];
        for (let i = 0; i < scale.length; i++) {
          if (percentage >= scale[i]) {
            return grades[i];
          }
        }

        return 'F';
      },

      /**
       * Shuffles an array randomly
       *
       * @param {Object[]} array - The array to shuffle.
       * @returns {Object[]} - The shuffled array
       */
      shuffle(array) {
        const size = array.length;
        for (let i = 0; i < size; i++) {
          const j = Math.round(i + ((size - 1 - i) * Math.random()));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }

        return array;
      },

      /**
       * Searches a string for a substring that is enclosed in parenthesis.
       *
       * @param {string} s - The string to search in.
       * @returns {Object[]} - The result of RegExp.prototype.exec().
       */
      findSubstringEnclosedInParenthesis(s) {
        return /\(([^)]+)\)/.exec(s);
      },


      /**
       * Returns the current ISO 8601-formatted time with timezone offset.
       *
       * @returns {string} - ISO 860-formatted timestamp with timezone offset.
       */
      getLocalTime() {
        const now = new Date();
        const timezoneOffset = -now.getTimezoneOffset();
        const sign = timezoneOffset >= 0 ? '+' : '-';
        const pad = (num) => {
          const norm = Math.abs(Math.floor(num));
          return (norm < 10 ? '0' : '') + norm;
        };

        return `${now.getFullYear()
           }-${pad(now.getMonth() + 1)
           }-${pad(now.getDate())
           }T${pad(now.getHours())
           }:${pad(now.getMinutes())
           }:${pad(now.getSeconds())
           }${sign}${pad(timezoneOffset / 60)
           }:${pad(timezoneOffset % 60)}`;
      },
    }));
