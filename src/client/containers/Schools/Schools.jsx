import React from 'react';
import Jumbotron from '../../components/Jumbotron';
import Helpers from '../../components/util/Helpers';
import API from '../../components/API/API';

class Schools extends React.Component {

  // Returns a pretty header for the school (the abbreviated name)
  static header(school) {
    // Find abbreviation enclosed in parenthesis
    const abb = Helpers.findSubstringEnclosedInParenthesis(school);
    if (abb) return abb[1];

    // If no abbreviation, make one from the leading letters in each word
    return school.split(' ').map(e => e[0]).join('');
  }

  // Returns the full name of the school. Removes abbr. and parenthesis from school string
  static name(school) {
    // Find abbreviation enclosed in parenthesis
    const abb = Helpers.findSubstringEnclosedInParenthesis(school);
    return (abb) ? school.replace(abb[0], '') : school;
  }

  constructor() {
    super();
    this.state = {
      schools: [],
    };

    this.fetchSchools();
  }

  fetchSchools() {
    API.get('/api/list/schools', {}, (data) => {
      this.setState({ schools: data });
    });
  }

  render() {
    return (
      <div>
        <Jumbotron />

        <div className="container">
          <div className="row">

            {this.state.schools.forEach(school => <div className="col-xs-12 col-sm-6 col-lg-3">

              <kitem
                head={this.header(school)}
                body={this.name(school)}
                color="green"
                onClick="console.log('I AM YOUR FATHER')"
              />

            </div>)}

          </div>
        </div>
      </div>
    );
  }
}

export default Schools;
