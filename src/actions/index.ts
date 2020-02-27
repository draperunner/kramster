import { LoadingAction } from './LoadingActions'
import { QuestionAction } from './QuestionActions'

export type Action = LoadingAction | QuestionAction

export type Dispatch = (action: Action) => void
