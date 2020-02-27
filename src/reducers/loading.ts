import { Action } from '../actions'
import { START_LOADING, STOP_LOADING } from '../actions/LoadingActions'

export interface State {
  loading: boolean
}

const initialState: State = {
  loading: false,
}

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case START_LOADING: {
      return {
        loading: true,
      }
    }
    case STOP_LOADING: {
      return {
        loading: false,
      }
    }
    default:
      return state
  }
}
