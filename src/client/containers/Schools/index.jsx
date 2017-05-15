import React from 'react';
import { browserHistory } from 'react-router';
import { Row, Col } from 'react-flexbox-grid';
import API from '../../api';
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
      <div>
        <Jumbotron gradesData={this.state.gradesData} />

        <div className="container">
          <Row>

            {this.state.schools.map(school => (
              <Col xs={12} sm={6} lg={3} key={school}>
                <Kitem
                  head={header(school)}
                  body={name(school)}
                  color="green"
                  onClick={() => browserHistory.push(`/${header(school)}`)}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  }
}

export default Schools;
