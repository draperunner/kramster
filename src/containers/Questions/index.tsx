import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-flexbox-grid'
import { getQuestions, sendReport } from '../../api'
import { LoadingSpinner, ProgressBar } from '../../components'
import { getLocalTime, percentageToGrade } from '../../utils'
import Question from './Question'
import Explanation from './Explanation'
import Alternative from '../../components/Buttons/Alternative'
import { Question as QuestionType, SendableReport } from '../../interfaces'

import styles from './Questions.css'
import { useHistory, useStats } from '../../hooks/contexts'

type Props = {
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

function Questions(props: Props): JSX.Element {
  // String representing the doc fetch mode. 'random' if Random X is clicked, etc.
  let mode: 'all' | 'exam' | 'random' | 'hardest' = 'exam'

  if (!props.params.exam && !props.params.mode) {
    mode = 'all'
  } else if (props.params.mode) {
    mode = props.params.mode
  }

  const [, setStats] = useStats()

  const [loading, setLoading] = useState<boolean>(false)
  const [answerGiven, setAnswerGiven] = useState<boolean>(false)
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(
    null,
  )
  const [history, setHistory] = useHistory()

  const { school, course, exam, number } = props.params

  useEffect(() => {
    setLoading(true)
    setHistory([])

    getQuestions(school, course, {
      mode,
      exam,
      limit: number,
    }).then((questions: QuestionType[]) => {
      setLoading(false)
      setQuestions(questions)
      setCurrentQuestion(questions[0])
    })
  }, [course, exam, mode, school, number, setHistory])

  const answerIsCorrect = (
    givenAnswer: string,
    currentQuestion: QuestionType,
  ): boolean => {
    const q = currentQuestion
    return q && q.answers.indexOf(q.options.indexOf(givenAnswer)) >= 0
  }

  // Get the (current) ratio of correct answers per total number of answered questions.
  const percentage = (): number => {
    if (history.length === 0) return 0
    const numCorrect = history.filter(q => q.wasCorrect).length
    return Math.round((10000 * numCorrect) / history.length) / 100
  }

  // Returns the class (color, mostly) of the option button
  // decided by if it's the right answer or not.
  const buttonClass = (
    option: string,
  ): 'alternativeMobile' | 'alternative' | 'correctAnswer' | 'wrongAnswer' => {
    if (!answerGiven) {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
      return mobile ? 'alternativeMobile' : 'alternative'
    }

    const previousQuestion = questions[history.length - 1]

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

  const finished = (): boolean => {
    return history.length >= questions.length && questions.length !== 0
  }

  const reportResults = (): Promise<void> => {
    const report: SendableReport = {
      exam: {
        school: props.params.school,
        course: props.params.course,
        name: mode !== 'exam' ? mode : props.params.exam,
      },
      createdAt: getLocalTime(),
      history,
      score: history.filter(q => q.wasCorrect).length,
      numQuestions: questions.length,
      percentage: percentage(),
      grade: percentageToGrade(percentage()),
    }

    return sendReport(report).then(stats => {
      setStats({ ...stats, numQuestions: report.numQuestions })
    })
  }

  const answer = (givenAnswer: string): void => {
    if (finished()) {
      reportResults().then(() => {
        props.router.push(`${props.location.pathname}/results`)
      })
      return
    }

    if (!currentQuestion) return
    if (!answerGiven) {
      setHistory(prevHistory => [
        ...prevHistory,
        {
          questionId: currentQuestion._id,
          givenAnswer,
          wasCorrect: answerIsCorrect(givenAnswer, currentQuestion),
        },
      ])
    } else {
      setCurrentQuestion(questions[history.length])
    }

    setAnswerGiven(prevAnswerGiven => !prevAnswerGiven)
  }

  if (loading || !currentQuestion) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <ProgressBar
        history={history.map(q => q.wasCorrect)}
        questions={questions}
      />

      {questions.length ? (
        <Row className={styles.questionRow}>
          <Col xs={12}>
            <Question text={currentQuestion.question} />
          </Col>
        </Row>
      ) : null}

      {questions.length ? (
        <Row className={styles.alternativesRow}>
          <Col xs={12} className={styles.alternativesCol}>
            {currentQuestion.options.map(option => (
              <Alternative
                key={option}
                text={option}
                type={buttonClass(option)}
                onClick={(): void => answer(option)}
              />
            ))}
            {answerGiven ? (
              <div>
                <Explanation text={currentQuestion.explanation} />
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

export default Questions
