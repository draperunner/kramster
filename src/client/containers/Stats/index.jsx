import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import API from '../../api';
import BubbleChart from '../../components/BubbleChart';
import styles from './Stats.css';

class Stats extends React.Component {

  constructor() {
    super();

    this.state = {
      gradesData: null,
      reports: [],
      bubbleData: [],
    };
  }

  componentDidMount() {
    this.fetchGrades();
    this.fetchReports();
  }

  fetchGrades() {
    API.get('/api/stats/').then((data) => {
      this.setState({ gradesData: data.grades });
    });
  }

  fetchReports() {
    API.get('/api/reports?after=2017-05-25').then((data) => {
      this.setState({ reports: data });
      this.makeBubbleChartData();
    });
  }

  makeBubbleChartData() {
    if (this.state.reports.length === 0) {
      return;
    }

    // { YYYY-MM-DD: { score, ... }}
    const reportsByWeekday = {};

    this.state.reports.forEach((report) => {
      const weekday = new Date(report.createdAt.slice(0, 10)).getDay();

      if (!reportsByWeekday[weekday]) {
        reportsByWeekday[weekday] = [];
      }

      reportsByWeekday[weekday].push(report);
    });

    const xValues = Object.keys(reportsByWeekday).sort();

    const data = [];

    xValues.forEach((x) => {
      const ys = {};
      for (let i = 0; i < reportsByWeekday[x].length; i++) {
        const report = reportsByWeekday[x][i];
        const y = report.createdAt.slice(11, 13);
        ys[y] = reportsByWeekday[x].filter(r => r.createdAt.slice(11, 13) === y).length;
      }
      Object.keys(ys).forEach((y) => {
        data.push({
          x,
          y: Number(y),
          r: ys[y],
        });
      });
    });

    this.setState({ bubbleData: data });
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
            <h3>Time stats</h3>
            { this.state.gradesData ? <BubbleChart data={this.state.bubbleData} /> : null }
          </Col>
          <Col xs={12} md={4}>
            <h3>Number of exams taken</h3>
            <h3>{ this.state.reports.length }</h3>
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
