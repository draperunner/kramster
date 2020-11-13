import React from 'react'
import { render } from 'react-dom'
import 'katex'
import 'katex/dist/katex.min.css'

import './base-styles/main.css'
import './auth'

import Routes from './routes'

render(<Routes />, document.getElementById('app'))
