import React from 'react'
import { render } from 'react-dom'
import Routes from './routes'
import 'katex'
import 'katex/dist/katex.min.css'

import './base-styles/main.css'
import './auth'

render(<Routes />, document.getElementById('app'))
