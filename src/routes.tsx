import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import AppContainer from './containers/AppContainer'
import About from './containers/About'
import Schools from './containers/Schools'
import Courses from './containers/Courses'
import Exams from './containers/Exams'
import Questions from './containers/Questions'
import Result from './containers/Result'
import { useAnonymousLogin, UserContext } from './auth'

export default function Routes(): JSX.Element {
  const user = useAnonymousLogin()

  return (
    <UserContext.Provider value={user}>
      <Router history={browserHistory}>
        <Route path="/" component={AppContainer}>
          <IndexRoute component={Schools} />
          <Route path="/about" component={About} />
          <Route path="/**/results" component={Result} />
          <Route path="/:school" component={Courses} />
          <Route path="/:school/:course" component={Exams} />
          <Route path="/:school/:course/:mode/:number" component={Questions} />
          <Route path="/:school/:course/:exam" component={Questions} />
        </Route>
      </Router>
    </UserContext.Provider>
  )
}
