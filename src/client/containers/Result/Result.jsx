import React from 'react';
import { connect } from 'react-redux';
import Kitem from '../../components/Kitem';

const Result = props => (
  <div>
    <div className="row">
      <div className="col-xs-12">
        <h1 className="grey">Your results</h1>
      </div>

      <div className="col-xs-12 col-md-4">
        <Kitem
          head={props.stats.grade()}
          body="Grade"
          clickable={false}
          color={props.colors.fromUser()}
        />
      </div>

      <div className="col-xs-6 col-md-4">
        <Kitem
          head={props.stats.score()}
          body="Score"
          clickable={false}
          color={props.colors.fromUser()}
        />
      </div>

      <div className="col-xs-6 col-md-4">
        <Kitem
          head={props.stats.percentage()}
          body="%"
          clickable={false}
          color={props.colors.fromUser()}
        />
      </div>

    </div>

    <div className="row top-buffer">
      <div className="col-xs-12">
        <h1 className="grey">Stats for this exam</h1>
      </div>

      <div className="col-xs-12 col-md-4" ng-if="props.stats.fromServer">
        <Kitem
          head={props.stats.fromServer.averageGrade}
          body="Average Grade"
          clickable={false}
          color={props.colors.fromServer()}
        />
      </div>
      <div className="col-xs-6 col-md-4" ng-if="props.stats.fromServer">
        <Kitem
          head={props.stats.fromServer.averageScore}
          body="Average Score"
          clickable={false}
          color={props.colors.fromServer()}
        />
      </div>
      <div className="col-xs-6 col-md-4" ng-if="props.stats.fromServer">
        <Kitem
          head={props.stats.fromServer.percentage}
          body="Average %"
          clickable={false}
          color={props.colors.fromServer()}
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
        <div className="div-result btn btn-result-btn" ng-click="questionsCtrl.reloadRoute()" role="button">
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
  stats: React.PropTypes.shape({
    grade: React.PropTypes.func,
    score: React.PropTypes.func,
    percentage: React.PropTypes.func,
    fromServer: React.PropTypes.shape({
      percentage: React.PropTypes.string,
      averageGrade: React.PropTypes.string,
      averageScore: React.PropTypes.string,
    }),
  }),
  colors: React.PropTypes.shape({
    grade: React.PropTypes.func,
    score: React.PropTypes.func,
    fromUser: React.PropTypes.func,
    fromServer: React.PropTypes.func,
  }),
};

const mapStateToProps = state => ({
  history: state.questions.history,
});

export default connect(mapStateToProps)(Result);
