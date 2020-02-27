import { combineReducers } from 'redux'
import loading from './loading'
import questions from './questions'

const rootReducer = combineReducers({
  loading,
  questions,
})

export type ReduxState = ReturnType<typeof rootReducer>

export default rootReducer
