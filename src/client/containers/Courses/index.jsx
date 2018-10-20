import React from 'react';
import { browserHistory } from 'react-router';
import { Row, Col } from 'react-flexbox-grid';
import { getCourses } from '../../api';
import Kitem from '../../components/Kitem';
import styles from './Courses.css';

// Returns a pretty header for the course (the course code)
function getCourseHeader(course) {
  return course.split(' ')[0].toUpperCase();
}

// Returns the full name of the course. Removes course code
function getCourseName(course) {
  return course.replace(course.split(' ')[0], '').trim();
}

class Courses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      school: props.params.school,
      courses: [],
    };
  }

  componentDidMount() {
    getCourses(this.state.school).then((data) => {
      this.setState({ courses: data });
    });
  }

  render() {
    const availableColors = ['orange', 'green', 'red', 'blue', 'purple', 'yellow'];
    const assignedColors = {};
    let colorIndex = 0;

    // Assign different colors to each department
    const assignColor = (courseCode) => {
      const firstDigit = courseCode.match(/\d/);
      const indexOfFirstDigit = courseCode.indexOf(firstDigit);
      const departmentCode = courseCode.substring(0, indexOfFirstDigit);
      if (assignedColors[departmentCode]) return assignedColors[departmentCode];
      assignedColors[departmentCode] = availableColors[colorIndex % availableColors.length];
      colorIndex += 1;
      return assignedColors[departmentCode];
    };

    return (
      <Row className={styles.coursesRow}>
        { this.state.courses.map((course) => {
          const header = getCourseHeader(course);
          const name = getCourseName(course);
          return (
            <Col key={course} xs={12} sm={6} md={4} lg={3}>
              <Kitem
                head={header}
                body={name}
                color={assignColor(header)}
                minHeight
                onClick={() => browserHistory.push(`/${this.state.school}/${header}`)}
              />
            </Col>
          );
        })}
      </Row>
    );
  }
}

export default Courses;
