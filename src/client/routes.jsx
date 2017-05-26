import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import ReactGA from 'react-ga';

import AppContainer from './containers/AppContainer';
import About from './containers/About';
import Stats from './containers/Stats';
import Schools from './containers/Schools';
import Courses from './containers/Courses';
import Exams from './containers/Exams';
import Questions from './containers/Questions';
import Result from './containers/Result';

ReactGA.initialize('UA-62911300-1');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

export default
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={Schools} />
      <Route path="/about" component={About} />
      <Route path="/stats" component={Stats} />
      <Route path="/**/results" component={Result} />
      <Route path="/:school" component={Courses} />
      <Route path="/:school/:course" component={Exams} />
      <Route path="/:school/:course/:mode/:number" component={Questions} />
      <Route path="/:school/:course/all" component={Questions} />
      <Route path="/:school/:course/:exam" component={Questions} />
    </Route>
  </Router>;
