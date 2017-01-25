import React from 'react';
import Jumbotron from '../../components/Jumbotron';
import API from '../../components/API/API';
import { header, name } from './methods';


class Schools extends React.Component {

  constructor() {
    super();

    this.state = {
      schools: [],
    };
  }

  componentDidMount() {
    this.fetchSchools();
  }

  fetchSchools() {
    API.get('/api/list/schools', {}).then((data) => {
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
                head={header(school)}
                body={name(school)}
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
