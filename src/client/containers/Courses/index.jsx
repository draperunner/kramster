import React from 'react';
import { browserHistory } from 'react-router';
import API from '../../components/API';
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
      <div className="container">
        <div className="row">
          { this.state.courses.map((course, index) =>
            <div key={course}>
              {index % 2 === 0 ? <div className="clearfix visible-sm-block" /> : null }
              {index % 3 === 0 ? <div className="clearfix visible-md-block" /> : null }
              {index % 4 === 0 ? <div className="clearfix visible-lg-block" /> : null }

              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" >

                <Kitem
                  head={header(course)}
                  body={name(course)}
                  color={assignColor(header(course))}
                  minHeight
                  onClick={() => browserHistory.push(`/${this.state.school}/${header(course)}`)}
                />

              </div>
            </div>,
          )}
        </div>
      </div>

    );
  }
}

export default Courses;
