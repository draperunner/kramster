import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-flexbox-grid'
import Navbar from '../components/Navbar'

const App = (props) => (
  <Grid>
    <Navbar />

    {props.children}
  </Grid>
)

App.propTypes = {
  children: PropTypes.node,
}

export default App
