import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import API from '../../api';
import BarChart from '../../components/BarChart';
import styles from './Stats.css';

class Stats extends React.Component {

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
        <div className={styles.stats}>
          <h1 className={styles.title}>Stats</h1>
          <h3 className={styles.intro}>
            Statistics are cool!
          </h3>
        </div>

        <Row className={styles.linksRow}>
          <Col xs={12} md={4}>
            <h3>Grade stats</h3>
            { this.state.gradesData ? <BarChart data={this.state.gradesData} /> : null }
          </Col>
          <Col xs={12} md={4}>
            <h3>Number of exams taken</h3>
            <h3>12</h3>
          </Col>
          <Col xs={12} md={4}>
            <h3>Hardest question</h3>
            <h4>What is a banana?</h4>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Stats;
