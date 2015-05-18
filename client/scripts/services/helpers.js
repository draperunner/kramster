'use strict';

/*
 * Contains static helper methods.
 */

angular.module('kramster')
    .service('Helpers', function() {

        /* Takes string and replaces add spaces with underscores */
        this.underscorify = function(documentName) {
            return documentName.replace(/ /g, '_');
        };

        /* Shuffles an array randomly */
        this.shuffle = function(array) {
            var size = array.length;
            for (var i=0; i < size; i++) {
                var j = Math.round(i + (size - 1 - i) * Math.random());
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        };

    });