import React from 'react';
import Jumbotron from '../components/Jumbotron';

const Schools = () => {
  angular.module('kramster')
    .controller('SchoolListController', ['$scope', '$location', 'Helpers', 'httpRequest', 'apiUrl',
      function SchoolListController($scope, $location, Helpers, httpRequest, apiUrl) {
        const vm = this;

        // Returns a pretty header for the school (the abbreviated name)
        vm.header = (school) => {
          // Find abbreviation enclosed in parenthesis
          const abb = Helpers.findSubstringEnclosedInParenthesis(school);
          if (abb) return abb[1];

          // If no abbreviation, make one from the leading letters in each word
          return school.split(' ').map(e => e[0]).join('');
        };

        // Returns the full name of the school. Removes abbr. and parenthesis from school string
        vm.name = (school) => {
          // Find abbreviation enclosed in parenthesis
          const abb = Helpers.findSubstringEnclosedInParenthesis(school);
          return (abb) ? school.replace(abb[0], '') : school;
        };

        vm.helpers = Helpers;
        vm.schools = [];

        httpRequest.get(`${apiUrl}list/schools`, {}, (data) => {
          vm.schools = data;
        });
      },
    ]);

  return (<div>
    <Jumbotron />

    <div className="container">
      <div className="row">

        <div className="col-xs-12 col-sm-6 col-lg-3" ng-repeat="school in schoolsCtrl.schools">

          <kitem
            head="{{schoolsCtrl.header(school)}}"
            body="{{schoolsCtrl.name(school)}}"
            color="green"
            ng-click="go('/'+schoolsCtrl.header(school))"
          />

        </div>

      </div>
    </div>
  </div>);
};
