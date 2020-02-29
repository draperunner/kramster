import { render } from 'react-dom'
import routes from './routes'
import 'katex'
import 'katex/dist/katex.min.css'

import './base-styles/main.css'

render(routes, document.getElementById('app'))
