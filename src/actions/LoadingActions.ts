export const START_LOADING = 'START_LOADING'
export const STOP_LOADING = 'STOP_LOADING'

interface StartLoading {
  type: 'START_LOADING';
}

export const startLoading = (): StartLoading => ({
  type: START_LOADING,
})

interface StopLoading {
  type: 'STOP_LOADING';
}

export const stopLoading = (): StopLoading => ({
  type: STOP_LOADING,
})

export type LoadingAction = StartLoading | StopLoading
