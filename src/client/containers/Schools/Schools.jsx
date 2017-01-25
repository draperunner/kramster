import React from 'react';
import API from '../../components/API/API';
import Jumbotron from '../../components/Jumbotron';
import Kitem from '../../components/Kitem';
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

            {this.state.schools.map(school => <div key={school} className="col-xs-12 col-sm-6 col-lg-3">

              <Kitem
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
