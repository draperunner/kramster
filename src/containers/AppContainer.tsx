import React, { ReactNode } from 'react'
import { Grid } from 'react-flexbox-grid'
import { Navbar } from '../components'

const App = (props: Props): JSX.Element => (
  <Grid>
    <Navbar />

    {props.children}
  </Grid>
)

interface Props {
  children: ReactNode
}

export default App
