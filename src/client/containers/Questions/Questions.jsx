import React from 'react';
import { browserHistory } from 'react-router';
import API from '../../components/API/API';
import Helpers from '../../components/util/Helpers';
import ProgressBar from '../../components/ProgressBar';

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
      questions: [],
      history: [],
      answerGiven: false, // True if an answer is selected.
      finishedReturnedTrue: false, // Prevents multiples of the same report being sent to server.
      route: {
        school: props.params.school,
        course: props.params.course,
        exam: props.params.exam,
        number: props.params.number,
      },
      // String representing the doc fetch mode.
      // 'all' if All button is clicked. 'random' if Random X is clicked, etc.
      mode: {
        docMode: 'exam',
      },
    };

    if (!props.params.exam) {
      this.state.mode.docMode = props.params.number ? 'random' : 'all';
    }

    // Empty dummy question
    this.emptyQuestion = { question: '', options: [] };
  }

  componentDidMount() {
    let url = `/api/exams/${this.state.route.school}/${this.state.route.course}`;

    if (this.state.mode.docMode === 'all') {
      // ALL MODE. Fetches all exams, gathers all questions from all of them, shuffles.
      API.getAll(url, (questions) => {
        this.setState({
          questions,
        });
      });
    } else if (this.state.mode.docMode === 'random') {
      // RANDOM N MODE. Fetches n random questions from the course.
      API.getRandom(url, this.state.route.number).then((questions) => {
        this.setState({
          questions,
        });
      });
    } else {
      // NON-RANDOM MODE. Fetches the selected exam and shuffles its questions.
      url += `/${this.state.route.exam}`;
      API.getSelected(url, {}).then((exam) => {
        this.setState({
          questions: exam[0].questions,
        });
      });
    }
  }

  // Get the (current) ratio of correct answers per total number of answered questions.
  percentage(dividend, divisor) {
    if (!dividend && !divisor) {
      return (this.numAnswered() > 0)
      ? Math.round((10000 * this.numCorrects()) / this.numAnswered()) / 100 : 0;
    } else if (dividend && divisor) {
      return (divisor > 0) ? Math.round((10000 * dividend) / divisor) / 100 : 0;
    }
    return 0;
  }

  // Returns a score status message. Example: "3 (60%)"
  status(score) {
    if (!score) {
      return `${this.numCorrects()} (${this.percentage()}%)`;
    }

    return `${score.toFixed(2)} (${this.percentage(score, this.state.questions.length)}%)`;
  }

  // Returns the grade corresponding to the current percentage. Uses the NTNU scale.
  grade() {
    return Helpers.percentageToGrade(this.percentage());
  }

  // Number of correct answers
  score() {
    return this.numCorrects();
  }

  // Total number of answers.
  numAnswered() {
    return this.state.history.length;
  }

  // Total number of correct answers.
  numCorrects() {
    return this.state.history.filter(Boolean).length;
  }

  // Returns the current question
  currentQuestion() {
    let question;

    // If questions still are being fetched, return an empty question.
    if (this.state.questions.length <= 0) {
      question = this.emptyQuestion;
    } else if (this.state.answerGiven) {
      question = this.state.questions[this.state.history.length - 1];
    } else {
      question = this.state.questions[this.state.history.length];
    }

    /*
    // Render math
    const domElementsThatMightContainMath = document.getElementsByClassName('math');
    for (let i = 0; i < domElementsThatMightContainMath.length; i++) {
      renderMathInElement(domElementsThatMightContainMath[i]);
    }
    */

    return question;
  }

  numberOfQuestions() {
    return this.state.questions.length;
  }

  // Returns the class (color, mostly) of the option button
  // decided by if it's the right answer or not.
  buttonClass(option) {
    if (!this.state.answerGiven) {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return mobile ? 'btn-question-mobile' : 'btn-question';
    }

    const previousQuestion = this.state.questions[this.state.history.length - 1];

    // Check if the option the button represents is one of the correct answers.
    if (previousQuestion.answers.indexOf(previousQuestion.options.indexOf(option)) >= 0) {
      return 'btn-correct-answer';
    }

    return 'btn-wrong-answer';
  }

  // Checks if exam is finished. Reports stats to server if true.
  // Fetches aggregated stats from server.
  finished() {
    if (this.currentQuestion()) {
      return false;
    }

    if (!this.state.finishedReturnedTrue) {
      this.setState({
        finishedReturnedTrue: true,
      });

      const report = {
        exam: {
          school: this.state.route.school,
          course: this.state.route.course,
          name: (this.state.mode.docMode) ? this.state.mode.docMode : this.state.route.exam,
        },
        createdAt: Helpers.getLocalTime(),
        score: this.numCorrects(),
        numQuestions: this.state.questions.length,
        percentage: this.percentage(),
        grade: this.grade(),
      };
      API.post('/api/reports/add', report).then(() => {
        // Fetch aggregated statistics from server
        const url = `/api/stats/${this.state.route.school}/${this.state.route.course}/${report.exam.name}`;

        const params = {};
        if (report.exam.name === 'random') {
          params.numQuestions = this.state.questions.length;
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
    }

    return true;
  }

  // Is called when the user selects an answer.
  answer(option) {
    const newState = {
      answerGiven: !this.state.answerGiven,
    };

    if (!this.state.answerGiven) {
      const q = this.currentQuestion();
      newState.history = [...this.state.history, q && q.answers.indexOf(q.options.indexOf(option)) >= 0];
    }

    this.setState(newState, () => {
      if (this.finished()) {
        browserHistory.push('/result');
      }
    });
  }

  render() {
    const question = this.currentQuestion();
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <ProgressBar history={this.state.history} questions={this.state.questions} />
          </div>
        </div>

        { this.state.questions.length /* && !loading */ ?
          <div className="row">
            <div className="col-xs-12">
              <h3 className="question math">
                { question && question.question }
              </h3>
            </div>
          </div>
        : null }

        { this.state.questions.length /* && !loading */ ?
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

export default Questions;
