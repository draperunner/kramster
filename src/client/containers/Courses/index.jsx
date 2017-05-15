import React from 'react';
import { browserHistory } from 'react-router';
import { Row, Col } from 'react-flexbox-grid';
import API from '../../api';
import Kitem from '../../components/Kitem';

class Courses extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      school: props.params.school,
      courses: [],
    };
  }

  componentDidMount() {
    this.fetchCourses();
  }

  fetchCourses() {
    API.get(`/api/list/courses/${this.state.school}`, {}).then((data) => {
      this.setState({ courses: data });
    });
  }

  render() {
    // Returns a pretty header for the course (the course code)
    const header = course => course.split(' ')[0].toUpperCase();

    // Returns the full name of the course. Removes course code
    const name = course => course.replace(course.split(' ')[0], '').trim();

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
      <Row>
        { this.state.courses.map(course => (
          <Col key={course} xs={12} sm={6} md={4} lg={3}>

            <Kitem
              head={header(course)}
              body={name(course)}
              color={assignColor(header(course))}
              minHeight
              onClick={() => browserHistory.push(`/${this.state.school}/${header(course)}`)}
            />

          </Col>
          ))}
      </Row>

    );
  }
}

export default Courses;
