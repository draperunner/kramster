'use strict';

/*
 * Contains static helper methods.
 */

angular.module('kramster')
    .service('Helpers', function () {

        // Takes string and replaces add spaces with underscores
        this.underscorify = function (documentName) {
            return documentName.replace(/ /g, '_');
        };

        // Returns the mapping from a percentage to grade
        this.percentageToGrade = function(percentage) {
            var scale = [89, 77, 65, 53, 41];
            var grades = ['A', 'B', 'C', 'D', 'E'];
            for (var i = 0; i < scale.length; i++) {
                if (percentage >= scale[i]) {
                    return grades[i];
                }
            }
            return 'F';
        };

        // Shuffles an array randomly
        this.shuffle = function (array) {
            var size = array.length;
            for (var i = 0; i < size; i++) {
                var j = Math.round(i + (size - 1 - i) * Math.random());
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        };

        // Sorts in reversed order because we want the newest exams to be on top. (2014 above 2013, etc.)
        // Somehow simply returning b-a does not work.
        this.reversedComparison = function (a, b) {
            if (a < b) {
                return 1;
            }
            if (a > b) {
                return -1;
            }
            return 0;
        };

        // Return the argument array with all duplicates removed
        this.removeDuplicates = function (arr) {
            return arr.reduce(function (accum, current) {
                if (accum.indexOf(current) < 0) {
                    accum.push(current);
                }
                return accum;
            }, []);
        };

        // Search a string for a substring that is enclosed in parenthesis
        this.findSubstringEnclosedInParenthesis = function (s) {
            const regExp = /\(([^)]+)\)/;
            return regExp.exec(s);
        };

    });
