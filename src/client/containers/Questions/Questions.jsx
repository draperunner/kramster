import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import API from '../../components/API/API';
import Helpers from '../../components/util/Helpers';
import ProgressBar from '../../components/ProgressBar';
import { giveAnswer, loadQuestions } from '../../actions/QuestionActions';

class Questions extends React.Component {

  static reloadRoute() {
    location.reload();
  }

  static colors() {
    // A: green, B: blue, C: purple, D: yellow, E: orange, F: red
    return {
      A: 'green',
      B: 'blue',
      C: 'purple',
      D: 'yellow',
      E: 'orange',
      F: 'red',
      fromUser() {
        return this.colors[this.grade()];
      },

      fromServer() {
        return this.colors[(this.fromServer && this.fromServer.averageGrade) || 'B'];
      },
    };
  }

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

  componentWillReceiveProps() {
    this.finished();
  }

  // Get the (current) ratio of correct answers per total number of answered questions.
  percentage(dividend, divisor) {
    if (!dividend && !divisor) {
      return (this.props.history.length > 0)
      ? Math.round((10000 * this.props.history.filter(Boolean).length) / this.props.history.length) / 100 : 0;
    } else if (dividend && divisor) {
      return (divisor > 0) ? Math.round((10000 * dividend) / divisor) / 100 : 0;
    }
    return 0;
  }

  // Returns a score status message. Example: "3 (60%)"
  status(score) {
    if (!score) {
      return `${this.props.history.filter(Boolean).length} (${this.percentage()}%)`;
    }

    return `${score.toFixed(2)} (${this.percentage(score, this.props.questions.length)}%)`;
  }

  // Returns the grade corresponding to the current percentage. Uses the NTNU scale.
  grade() {
    return Helpers.percentageToGrade(this.percentage());
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
        name: (this.state.mode.docMode) ? this.state.mode.docMode : this.props.params.exam,
      },
      createdAt: Helpers.getLocalTime(),
      score: this.props.history.filter(Boolean).length,
      numQuestions: this.props.questions.length,
      percentage: this.percentage(),
      grade: this.grade(),
    };
    API.post('/api/reports/add', report).then(() => {
        // Fetch aggregated statistics from server
      const url = `/api/stats/${this.props.params.school}/${this.props.params.course}/${report.exam.name}`;

      const params = {};
      if (report.exam.name === 'random') {
        params.numQuestions = this.props.questions.length;
      }

      API.get(url, params).then((stats) => {
        const totalNumberOfQuestions = stats.numReports * report.numQuestions;
        const avgPercentage = this.percentage(stats.totalScore, totalNumberOfQuestions);
        this.fromServer = stats;
        this.fromServer.averageScore = stats.averageScore.toFixed(2);
        this.fromServer.averageGrade = Helpers.percentageToGrade(avgPercentage);
        this.fromServer.percentage = avgPercentage;
      });
    });

    browserHistory.push(`${this.props.location}/results`);
    return true;
  }

  // Is called when the user selects an answer.
  answer(option) {
    this.props.answer(option);
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
              <h3 className="question math">
                { question && question.question }
              </h3>
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
                  >
                    {option}
                  </a>,
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
  loadQuestions: React.PropTypes.func,
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
  loadQuestions: (questions) => {
    dispatch(loadQuestions(questions));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
