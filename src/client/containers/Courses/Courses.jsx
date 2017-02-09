import React from 'react';
import { browserHistory } from 'react-router';
import API from '../../components/API/API';
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

    return (
      <div className="row">
        { this.state.courses.map((course, index) =>
          <div key={index}>
            {index % 2 === 0 ? <div className="clearfix visible-sm-block" /> : null }
            {index % 3 === 0 ? <div className="clearfix visible-sm-block" /> : null }
            {index % 4 === 0 ? <div className="clearfix visible-sm-block" /> : null }

            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" >

              <Kitem
                head={header(course)}
                body={name(course)}
                color="purple"
                minHeight
                onClick={() => browserHistory.push(`/${this.state.school}/${header(course)}`)}
              />

            </div>
          </div>,
        )}
      </div>

    );
  }
}

Courses.propTypes = {
};

export default Courses;
