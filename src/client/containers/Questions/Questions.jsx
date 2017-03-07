import React from 'react';
import { connect } from 'react-redux';
import sanitizeHtml from 'sanitize-html';
import API from '../../components/API/API';
import Helpers from '../../components/util/Helpers';
import ProgressBar from '../../components/ProgressBar';
import { clear, giveAnswer, loadQuestions, statsReceived } from '../../actions/QuestionActions';

class Questions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      finishedReturnedTrue: false, // Prevents multiples of the same report being sent to server.
      // String representing the doc fetch mode.
      // 'all' if All button is clicked. 'random' if Random X is clicked, etc.
      mode: {
        docMode: 'exam',
      },
    };

    if (!props.params.exam) {
      this.state.mode.docMode = props.params.number ? 'random' : 'all';
    }

    // Clear quiz history in case this is not the first quiz
    this.props.clear();
  }

  componentDidMount() {
    let url = `/api/exams/${this.props.params.school}/${this.props.params.course}`;

    if (this.state.mode.docMode === 'all') {
      // ALL MODE. Fetches all exams, gathers all questions from all of them, shuffles.
      API.getAll(url, (questions) => {
        this.props.loadQuestions(questions);
      });
    } else if (this.state.mode.docMode === 'random') {
      // RANDOM N MODE. Fetches n random questions from the course.
      API.getRandom(url, this.props.params.number).then((questions) => {
        this.props.loadQuestions(questions);
      });
    } else {
      // NON-RANDOM MODE. Fetches the selected exam and shuffles its questions.
      url += `/${this.props.params.exam}`;
      API.getSelected(url, {}).then((exam) => {
        this.props.loadQuestions(exam[0].questions);
      });
    }
  }

  // Get the (current) ratio of correct answers per total number of answered questions.
  percentage() {
    if (this.props.history.length === 0) return 0;
    return Math.round((10000 * this.props.history.filter(Boolean).length) / this.props.history.length) / 100;
  }

  // Returns the class (color, mostly) of the option button
  // decided by if it's the right answer or not.
  buttonClass(option) {
    if (!this.props.answerGiven) {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return mobile ? 'btn-question-mobile' : 'btn-question';
    }

    const previousQuestion = this.props.questions[this.props.history.length - 1];

    // Check if the option the button represents is one of the correct answers.
    if (previousQuestion.answers.indexOf(previousQuestion.options.indexOf(option)) >= 0) {
      return 'btn-correct-answer';
    }

    return 'btn-wrong-answer';
  }

  answer(givenAnswer) {
    if (this.finished()) {
      this.props.router.push(`${this.props.location.pathname}/results`);
    } else {
      this.props.answer(givenAnswer);
    }
  }

  // Checks if exam is finished. Reports stats to server if true.
  // Fetches aggregated stats from server.
  finished() {
    if (this.props.history.length < this.props.questions.length || this.props.questions.length === 0) {
      return false;
    }

    if (this.state.finishedReturnedTrue) {
      return true;
    }

    this.setState({
      finishedReturnedTrue: true,
    });

    const report = {
      exam: {
        school: this.props.params.school,
        course: this.props.params.course,
        name: (this.state.mode.docMode !== 'exam') ? this.state.mode.docMode : this.props.params.exam,
      },
      createdAt: Helpers.getLocalTime(),
      score: this.props.history.filter(Boolean).length,
      numQuestions: this.props.questions.length,
      percentage: this.percentage(),
      grade: Helpers.percentageToGrade(this.percentage()),
    };

    API.post('/api/reports/add', report).then(() => {
        // Fetch aggregated statistics from server
      const url = `/api/stats/${this.props.params.school}/${this.props.params.course}/${report.exam.name}`;

      const params = {};
      if (report.exam.name === 'random') {
        params.numQuestions = this.props.questions.length;
      }

      API.get(url, params).then((stats) => {
        this.props.statsReceived({ ...stats, numQuestions: report.numQuestions });
      });
    });

    return true;
  }

  render() {
    const question = this.props.currentQuestion;
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <ProgressBar history={this.props.history} questions={this.props.questions} />
          </div>
        </div>

        { this.props.questions.length /* && !loading */ ?
          <div className="row">
            <div className="col-xs-12">
              <h3
                className="question math"
                dangerouslySetInnerHTML={{ __html: question && sanitizeHtml(question.question) }}
              />
            </div>
          </div>
        : null }

        { this.props.questions.length /* && !loading */ ?
          <div className="row top-buffer">
            <div className="col-xs-12">
              <div className="btn-group">
                { question && question.options.map(option =>
                  <a
                    key={option}
                    role="button" type="button"
                    className={`btn mats ${this.buttonClass(option)}`}
                    onClick={() => this.answer(option)}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(option) }}
                  />,
                )}
              </div>
            </div>
          </div>
        : null }
      </div>
    );
  }
}

Questions.propTypes = {
  answer: React.PropTypes.func,
  answerGiven: React.PropTypes.bool,
  clear: React.PropTypes.func,
  loadQuestions: React.PropTypes.func,
  statsReceived: React.PropTypes.func,
  history: React.PropTypes.arrayOf(React.PropTypes.bool),
  currentQuestion: React.PropTypes.shape({
    answers: React.PropTypes.arrayOf(React.PropTypes.number),
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    question: React.PropTypes.string,
  }),
  questions: React.PropTypes.arrayOf(React.PropTypes.shape({
    answers: React.PropTypes.arrayOf(React.PropTypes.number),
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    question: React.PropTypes.string,
  })),
};

const mapStateToProps = state => ({
  answerGiven: state.questions.answerGiven,
  currentQuestion: state.questions.currentQuestion,
  history: state.questions.history,
  questions: state.questions.questions,
});

const mapDispatchToProps = dispatch => ({
  answer: (option) => {
    dispatch(giveAnswer(option));
  },
  clear: () => {
    dispatch(clear());
  },
  loadQuestions: (questions) => {
    dispatch(loadQuestions(questions));
  },
  statsReceived: (stats) => {
    dispatch(statsReceived(stats));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
