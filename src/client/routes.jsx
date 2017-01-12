import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import AppContainer from './containers/AppContainer';
import About from './containers/About';
import SchoolListContainer from './containers/SchoolListContainer';
import CourseListContainer from './containers/CourseListContainer';
import ExamListContainer from './containers/ExamListContainer';
import QuestionsContainer from './containers/QuestionsContainer';

export default
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={SchoolListContainer} />
      <Route path="/about" component={About} />
      <Route path="/:school" component={CourseListContainer} />
      <Route path="/:school/:course" component={ExamListContainer} />
      <Route path="/:school/:course/random/:number" component={QuestionsContainer} />
      <Route path="/:school/:course/all" component={QuestionsContainer} />
      <Route path="/:school/:course/:exam" component={QuestionsContainer} />
    </Route>
  </Router>;
