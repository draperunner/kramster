import { START_LOADING, STOP_LOADING } from '../actions/LoadingActions'

const initialState = {
  loading: false,
}

export default (state = initialState, action) => {
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
