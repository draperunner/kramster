import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import { getQuestions, sendReport } from '../../api'
import { LoadingSpinner, ProgressBar } from '../../components'
import { getLocalTime, percentageToGrade } from '../../utils'
import {
  clear,
  giveAnswer,
  loadQuestions,
  statsReceived,
} from '../../actions/QuestionActions'
import { startLoading, stopLoading } from '../../actions/LoadingActions'
import Question from './Question'
import Explanation from './Explanation'
import Alternative from '../../components/Buttons/Alternative'
import {
  HistoryEntry,
  Question as QuestionType,
  Stats,
  SendableReport,
} from '../../interfaces'

import styles from './Questions.css'
import { ReduxState } from '../../reducers'
import { Dispatch } from '../../actions'

interface Props {
  answer: (option: string) => void
  answerGiven: boolean
  clear: () => void
  loading: boolean
  loadQuestions: (questions: QuestionType[]) => void
  statsReceived: (stats: Stats & { numQuestions: number }) => void
  startLoading: () => void
  stopLoading: () => void
  history: HistoryEntry[]
  currentQuestion: QuestionType
  questions: QuestionType[]
  params: {
    exam: string
    school: string
    course: string
    mode: 'all' | 'exam' | 'random' | 'hardest'
    number: number
  }
  router: any
  location: Location
}

interface State {
  finishedReturnedTrue: boolean
  mode: 'all' | 'exam' | 'random' | 'hardest'
}

class Questions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    // String representing the doc fetch mode. 'random' if Random X is clicked, etc.
    let mode: 'all' | 'exam' | 'random' | 'hardest' = 'exam'

    if (!props.params.exam && !props.params.mode) {
      mode = 'all'
    } else if (props.params.mode) {
      mode = props.params.mode
    }

    this.state = {
      finishedReturnedTrue: false, // Prevents multiples of the same report being sent to server.
      mode,
    }

    // Clear quiz history in case this is not the first quiz
    this.props.clear()
  }

  componentDidMount(): void {
    const { school, course, exam, number } = this.props.params

    this.props.startLoading()

    getQuestions(school, course, {
      mode: this.state.mode,
      exam,
      limit: number,
    }).then((questions: QuestionType[]) => {
      this.props.stopLoading()
      this.props.loadQuestions(questions)
    })
  }

  // Get the (current) ratio of correct answers per total number of answered questions.
  percentage(): number {
    if (this.props.history.length === 0) return 0
    const numCorrect = this.props.history.filter(q => q.wasCorrect).length
    return Math.round((10000 * numCorrect) / this.props.history.length) / 100
  }

  // Returns the class (color, mostly) of the option button
  // decided by if it's the right answer or not.
  buttonClass(
    option: string,
  ): 'alternativeMobile' | 'alternative' | 'correctAnswer' | 'wrongAnswer' {
    if (!this.props.answerGiven) {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
      return mobile ? 'alternativeMobile' : 'alternative'
    }

    const previousQuestion = this.props.questions[this.props.history.length - 1]

    // Check if the option the button represents is one of the correct answers.
    if (
      previousQuestion.answers.indexOf(
        previousQuestion.options.indexOf(option),
      ) >= 0
    ) {
      return 'correctAnswer'
    }

    return 'wrongAnswer'
  }

  answer(givenAnswer: string): void {
    if (this.finished()) {
      this.props.router.push(`${this.props.location.pathname}/results`)
    } else {
      this.props.answer(givenAnswer)
    }
  }

  // Checks if exam is finished. Reports stats to server if true.
  // Fetches aggregated stats from server.
  finished(): boolean {
    if (
      this.props.history.length < this.props.questions.length ||
      this.props.questions.length === 0
    ) {
      return false
    }

    if (this.state.finishedReturnedTrue) {
      return true
    }

    this.setState({
      finishedReturnedTrue: true,
    })

    const report: SendableReport = {
      exam: {
        school: this.props.params.school,
        course: this.props.params.course,
        name:
          this.state.mode !== 'exam' ? this.state.mode : this.props.params.exam,
      },
      createdAt: getLocalTime(),
      history: this.props.history,
      score: this.props.history.filter(q => q.wasCorrect).length,
      numQuestions: this.props.questions.length,
      percentage: this.percentage(),
      grade: percentageToGrade(this.percentage()),
    }

    sendReport(report).then(stats => {
      this.props.statsReceived({ ...stats, numQuestions: report.numQuestions })
    })

    return true
  }

  render(): JSX.Element {
    const question = this.props.currentQuestion

    if (this.props.loading) {
      return <LoadingSpinner />
    }

    return (
      <div>
        <ProgressBar
          history={this.props.history.map(q => q.wasCorrect)}
          questions={this.props.questions}
        />

        {this.props.questions.length ? (
          <Row className={styles.questionRow}>
            <Col xs={12}>
              <Question text={question.question} />
            </Col>
          </Row>
        ) : null}

        {this.props.questions.length ? (
          <Row className={styles.alternativesRow}>
            <Col xs={12} className={styles.alternativesCol}>
              {question &&
                question.options.map(option => (
                  <Alternative
                    key={option}
                    text={option}
                    type={this.buttonClass(option)}
                    onClick={(): void => this.answer(option)}
                  />
                ))}
              {this.props.answerGiven ? (
                <div>
                  <Explanation text={question.explanation} />
                  <b role="alert" className={styles.continueTip}>
                    Click any answer to continue
                  </b>
                </div>
              ) : null}
            </Col>
          </Row>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  answerGiven: state.questions.answerGiven,
  currentQuestion: state.questions.currentQuestion,
  history: state.questions.history,
  questions: state.questions.questions,
  loading: state.loading.loading,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  answer: (option: string): void => {
    dispatch(giveAnswer(option))
  },
  clear: (): void => {
    dispatch(clear())
  },
  loadQuestions: (questions: QuestionType[]): void => {
    dispatch(loadQuestions(questions))
  },
  statsReceived: (stats: Stats): void => {
    dispatch(statsReceived(stats))
  },
  startLoading: (): void => {
    dispatch(startLoading())
  },
  stopLoading: (): void => {
    dispatch(stopLoading())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
