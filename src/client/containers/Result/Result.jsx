import React from 'react';
import { connect } from 'react-redux';
import Kitem from '../../components/Kitem';
import Helpers from '../../components/util/Helpers';

const Result = props => (
  <div className="container">
    <div className="row">
      <div className="col-xs-12">
        <h1 className="grey">Your results</h1>
      </div>

      <div className="col-xs-12 col-md-4">
        <Kitem
          head={props.grade}
          body="Grade"
          clickable={false}
          color={props.colorFromUser}
        />
      </div>

      <div className="col-xs-6 col-md-4">
        <Kitem
          head={props.score}
          body="Score"
          clickable={false}
          color={props.colorFromUser}
        />
      </div>

      <div className="col-xs-6 col-md-4">
        <Kitem
          head={props.percentage}
          body="%"
          clickable={false}
          color={props.colorFromUser}
        />
      </div>

    </div>

    <div className="row top-buffer">
      <div className="col-xs-12">
        <h1 className="grey">Stats for this exam</h1>
      </div>

      <div className="col-xs-12 col-md-4">
        <Kitem
          head={props.averageGrade}
          body="Average Grade"
          clickable={false}
          color={props.colorFromServer}
        />
      </div>
      <div className="col-xs-6 col-md-4">
        <Kitem
          head={props.averageScore}
          body="Average Score"
          clickable={false}
          color={props.colorFromServer}
        />
      </div>
      <div className="col-xs-6 col-md-4">
        <Kitem
          head={props.percentage}
          body="Average %"
          clickable={false}
          color={props.colorFromServer}
        />
      </div>
    </div>

    <div className="row top-buffer">
      {/*
      <div className="col-xs-12 col-md-4" ng-controller="PieController as PieCtrl">
        <canvas
          id="pie"
          className="chart chart-pie"
          chart-data="data"
          chart-labels="labels"
          chart-options="options"
        />
      </div>
      <div className="col-xs-12 col-md-4" ng-controller="BarController as BarCtrl">
        <canvas
          className="chart chart-bar"
          chart-data="data"
          chart-labels="labels"
          chart-options="options"
          chart-colours="colors"
        />
      </div>
      */}
      <div className="col-xs-12 col-md-4">
        <div className="div-result btn btn-result-btn" onClick={Helpers.reloadRoute()} role="button">
          <div className="header">
            <h4>Try again</h4>
          </div>
        </div>
        <div
          className="div-result btn btn-result-btn"
          ng-click="go('/'+questionsCtrl.route.school+'/'+questionsCtrl.route.course)"
          role="button"
        >
          <div className="header">
            <h4>Try another</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Result.propTypes = {
  colorFromUser: React.PropTypes.string,
  colorFromServer: React.PropTypes.string,
  grade: React.PropTypes.string,
  score: React.PropTypes.number,
  percentage: React.PropTypes.number,
  averageGrade: React.PropTypes.string,
  averageScore: React.PropTypes.string,
};

const mapStateToProps = (state) => {
  const { history, stats } = state.questions;
  const totalNumberOfQuestions = stats.numReports * stats.numQuestions;
  const avgPercentage = Helpers.formatPercentage(stats.totalScore, totalNumberOfQuestions);
  const averageGrade = Helpers.percentageToGrade(avgPercentage);
  const score = history.filter(Boolean).length;
  const percentage = Helpers.formatPercentage(score, history.length);
  const grade = Helpers.percentageToGrade(percentage);
  const colors = Helpers.colors();
  const colorFromUser = colors[grade];
  const colorFromServer = colors[averageGrade];

  return {
    averageGrade,
    averageScore: stats.averageScore.toFixed(2),
    colorFromUser,
    colorFromServer,
    grade,
    percentage,
    score,
  };
};

export default connect(mapStateToProps)(Result);
