import React from 'react';
import Navbar from '../components/Navbar';

const App = props => (
  <div>
    <Navbar />
    <div id="spinner" ng-show="loading" />

    {props.children}
  </div>
);

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
