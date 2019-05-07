import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { getExams } from '../../api';
import CategoryButton from '../../components/Buttons/CategoryButton';
import StandardButton from '../../components/Buttons/StandardButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from './Exams.css';

class Exams extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      school: props.params.school,
      course: props.params.course,
      exams: [],
    };
  }

  componentDidMount() {
    const { school, course } = this.state;
    getExams(school, course).then((data) => {
      this.setState({ exams: data });
    });
  }

  render() {
    if (!this.state.exams || !this.state.exams.length) {
      return <LoadingSpinner />;
    }

    return (
      <div className={styles.wrapper}>
        <Row className={styles.categoriesRow}>
          <Col xs={4} className={styles.col}>
            <CategoryButton href={`/${this.state.school}/${this.state.course}/random/10`}>
              10 Random
            </CategoryButton>
          </Col>
          <Col xs={4} className={styles.col}>
            <CategoryButton href={`/${this.state.school}/${this.state.course}/random/30`}>
              30 Random
            </CategoryButton>
          </Col>
          <Col xs={4} className={styles.col}>
            <CategoryButton href={`/${this.state.school}/${this.state.course}/hardest/10`}>
              10 Hardest
            </CategoryButton>
          </Col>
        </Row>

        <Row className={styles.examsRow}>
          { this.state.exams.map(exam => (
            <Col key={exam} xs={6} md={4} lg={3} className={styles.col}>
              <StandardButton href={`/${this.state.school}/${this.state.course}/${exam}`}>
                { exam }
              </StandardButton>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default Exams;
