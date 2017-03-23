import React from 'react';
import { Link } from 'react-router';
import API from '../../components/API/API';

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
    this.fetchExams();
  }

  fetchExams() {
    API.get(`/api/list/exams/${this.state.school}/${this.state.course}`, { sort: '-alphabetically' }).then((data) => {
      this.setState({ exams: data });
    });
  }

  render() {
    return (
      <div className="container">

        <div className="row">
          <div className="col-sm-4">
            <Link
              to={`/${this.state.school}/${this.state.course}/random/10`}
              className="btn btn-exam-special" role="button"
            >10 Random</Link>
          </div>
          <div className="col-sm-4">
            <Link
              to={`/${this.state.school}/${this.state.course}/random/30`}
              className="btn btn-exam-special" role="button"
            >30 Random</Link>
          </div>
          <div className="col-sm-4">
            <Link
              to={`/${this.state.school}/${this.state.course}/all`}
              className="btn btn-exam-special" role="button"
            >All</Link>
          </div>
        </div>

        <div className="row top-buffer">
          { this.state.exams.map((exam, index) => (
            <div key={index}>
              {index % 2 === 0 ? <div className="clearfix visible-sm-block" /> : null }
              {index % 3 === 0 ? <div className="clearfix visible-sm-block" /> : null }
              {index % 4 === 0 ? <div className="clearfix visible-sm-block" /> : null }

              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <Link
                  to={`/${this.state.school}/${this.state.course}/${exam}`}
                  className="btn btn-exam"
                  role="button"
                >{ exam }</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Exams;
