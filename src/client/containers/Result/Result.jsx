import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Kitem from '../../components/Kitem';
import Helpers from '../../utils/Helpers';
import BarChart from '../../components/BarChart';
import PieChart from '../../components/PieChart';
import Button from '../../components/Button';

class Result extends React.Component {

  componentWillMount() {
    if (!this.props.history.length) {
      browserHistory.push(`/${this.props.params.splat}`);
    }
  }

  render() {
    return (<div className="container">
      <div className="row">
        <div className="col-xs-12">
          <h1 className="grey">Your results</h1>
        </div>

        <div className="col-xs-12 col-md-4">
          <Kitem
            head={this.props.grade}
            body="Grade"
            clickable={false}
            color={this.props.colorFromUser}
          />
        </div>

        <div className="col-xs-6 col-md-4">
          <Kitem
            head={this.props.score}
            body="Score"
            clickable={false}
            color={this.props.colorFromUser}
          />
        </div>

        <div className="col-xs-6 col-md-4">
          <Kitem
            head={this.props.percentage}
            body="%"
            clickable={false}
            color={this.props.colorFromUser}
          />
        </div>

      </div>

      <div className="row top-buffer">
        <div className="col-xs-12">
          <h1 className="grey">Stats for this exam</h1>
        </div>

        <div className="col-xs-12 col-md-4">
          <Kitem
            head={this.props.averageGrade}
            body="Average Grade"
            clickable={false}
            color={this.props.colorFromServer}
          />
        </div>
        <div className="col-xs-6 col-md-4">
          <Kitem
            head={this.props.averageScore}
            body="Average Score"
            clickable={false}
            color={this.props.colorFromServer}
          />
        </div>
        <div className="col-xs-6 col-md-4">
          <Kitem
            head={this.props.percentage}
            body="Average %"
            clickable={false}
            color={this.props.colorFromServer}
          />
        </div>
      </div>

      <div className="row top-buffer">
        <div className="col-xs-12 col-md-4">
          { this.props.stats.grades ? <PieChart data={this.props.stats.grades} /> : null }
        </div>
        <div className="col-xs-12 col-md-4">
          { this.props.stats.grades ? <BarChart data={this.props.stats.grades} /> : null }
        </div>
        <div className="col-xs-12 col-md-4">
          <Button
            href={`/${this.props.params.splat}`}
            type="result"
          >
            <h4>Try again</h4>
          </Button>
          <Button
            href={`/${this.props.params.splat.split('/').slice(0, 2).join('/')}`}
            type="result"
          >
            <h4>Try another</h4>
          </Button>
        </div>
      </div>
    </div>);
  }
}

Result.propTypes = {
  colorFromUser: React.PropTypes.string,
  colorFromServer: React.PropTypes.string,
  grade: React.PropTypes.string,
  score: React.PropTypes.number,
  history: React.PropTypes.arrayOf(React.PropTypes.shape({
    questionId: React.PropTypes.string,
    givenAnswer: React.PropTypes.string,
    wasCorrect: React.PropTypes.bool,
  })),
  percentage: React.PropTypes.number,
  averageGrade: React.PropTypes.string,
  averageScore: React.PropTypes.string,
  stats: React.PropTypes.shape({
    grades: React.PropTypes.shape({
      A: React.PropTypes.number,
      B: React.PropTypes.number,
      C: React.PropTypes.number,
      D: React.PropTypes.number,
      E: React.PropTypes.number,
      F: React.PropTypes.number,
    }),
  }),
};

const mapStateToProps = (state) => {
  const { history, stats } = state.questions;
  const totalNumberOfQuestions = stats.numReports * stats.numQuestions;
  const avgPercentage = Helpers.formatPercentage(stats.totalScore, totalNumberOfQuestions);
  const averageGrade = Helpers.percentageToGrade(avgPercentage);
  const score = history.filter(q => q.wasCorrect).length;
  const percentage = Helpers.formatPercentage(score, history.length);
  const grade = Helpers.percentageToGrade(percentage);
  const colors = Helpers.colors();
  const colorFromUser = colors[grade];
  const colorFromServer = colors[averageGrade];

  return {
    averageGrade,
    averageScore: stats.averageScore && stats.averageScore.toFixed(2),
    colorFromUser,
    colorFromServer,
    history,
    grade,
    percentage,
    score,
    stats,
  };
};

export default connect(mapStateToProps)(Result);
