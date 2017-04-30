import React from 'react';
import { browserHistory } from 'react-router';
import API from '../../components/API';
import Jumbotron from '../../components/Jumbotron';
import Kitem from '../../components/Kitem';
import { header, name } from './methods';

class Schools extends React.Component {

  constructor() {
    super();

    this.state = {
      gradesData: null,
      schools: [],
    };
  }

  componentDidMount() {
    this.fetchGrades();
    this.fetchSchools();
  }

  fetchGrades() {
    API.get('/api/stats/').then((data) => {
      this.setState({ gradesData: data.grades });
    });
  }

  fetchSchools() {
    API.get('/api/list/schools').then((data) => {
      this.setState({ schools: data });
    });
  }

  render() {
    return (
      <div className="container">
        <Jumbotron gradesData={this.state.gradesData} />

        <div className="container">
          <div className="row">

            {this.state.schools.map(school => <div key={school} className="col-xs-12 col-sm-6 col-lg-3">
              <Kitem
                head={header(school)}
                body={name(school)}
                color="green"
                onClick={() => browserHistory.push(`/${header(school)}`)}
              />
            </div>)}
          </div>
        </div>
      </div>
    );
  }
}

export default Schools;
