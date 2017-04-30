import React from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';

const App = props => (
  <div>
    <Navbar />

    {props.children}
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
