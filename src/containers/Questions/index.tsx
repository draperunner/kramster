import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getQuestions, sendReport } from "../../api";
import { LoadingSpinner, ProgressBar } from "../../components";
import { getLocalTime, percentageToGrade } from "../../utils";
import Question from "./Question";
import Explanation from "./Explanation";
import Alternative from "../../components/Buttons/Alternative";
import { Question as QuestionType, SendableReport } from "../../interfaces";

import styles from "./Questions.module.css";
import { useHistory } from "../../hooks/contexts";
import { useUser } from "../../auth";

type Params = {
  exam: string | undefined;
  school: string | undefined;
  course: string | undefined;
  mode: "all" | "exam" | "random" | "hardest" | undefined;
  number: string | undefined;
};

function Questions(): JSX.Element {
  const user = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  // String representing the doc fetch mode. 'random' if Random X is clicked, etc.
  let mode: "all" | "exam" | "random" | "hardest" = "exam";

  const {
    school = "",
    course = "",
    exam = "",
    number = "",
    mode: paramMode,
  } = useParams<Params>();

  if (!exam && !paramMode) {
    mode = "all";
  } else if (paramMode) {
    mode = paramMode;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [answerGiven, setAnswerGiven] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(
    null,
  );
  const [history, setHistory] = useHistory();

  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setHistory([]);

    getQuestions(school, course, {
      mode,
      exam,
      limit: Number(number),
    }).then((questions: QuestionType[]) => {
      setLoading(false);
      setQuestions(questions);
      setCurrentQuestion(questions[0]);
    });
  }, [course, exam, mode, school, number, setHistory]);

  const answerIsCorrect = (
    givenAnswer: string,
    currentQuestion: QuestionType,
  ): boolean => {
    const q = currentQuestion;
    return q && q.answers.indexOf(q.options.indexOf(givenAnswer)) >= 0;
  };

  // Get the (current) ratio of correct answers per total number of answered questions.
  const percentage = (): number => {
    if (history.length === 0) return 0;
    const numCorrect = history.filter((q) => q.wasCorrect).length;
    return Math.round((10000 * numCorrect) / history.length) / 100;
  };

  // Returns the class (color, mostly) of the option button
  // decided by if it's the right answer or not.
  const buttonClass = (
    option: string,
  ): "alternativeMobile" | "alternative" | "correctAnswer" | "wrongAnswer" => {
    if (!answerGiven) {
      return "alternative";
    }

    const previousQuestion = questions[history.length - 1];

    // Check if the option the button represents is one of the correct answers.
    if (
      previousQuestion.answers.indexOf(
        previousQuestion.options.indexOf(option),
      ) >= 0
    ) {
      return "correctAnswer";
    }

    return "wrongAnswer";
  };

  const finished = (): boolean => {
    return history.length >= questions.length && questions.length !== 0;
  };

  const reportResults = (): Promise<void> => {
    const report: SendableReport = {
      uid: user?.uid || "unknown",
      exam: {
        school,
        course,
        name: mode !== "exam" ? mode : exam,
      },
      createdAt: getLocalTime(),
      history,
      score: history.filter((q) => q.wasCorrect).length,
      numQuestions: questions.length,
      percentage: percentage(),
      grade: percentageToGrade(percentage()),
    };

    return sendReport(report);
  };

  const answer = (givenAnswer: string): void => {
    if (finished()) {
      reportResults().then(() => {
        navigate(`${location.pathname}/results`);
      });
      return;
    }

    if (!currentQuestion) return;
    if (!answerGiven) {
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          questionId: currentQuestion.id,
          givenAnswer,
          wasCorrect: answerIsCorrect(givenAnswer, currentQuestion),
        },
      ]);
    } else {
      setCurrentQuestion(questions[history.length]);
      questionRef.current?.focus();
    }

    setAnswerGiven((prevAnswerGiven) => !prevAnswerGiven);
  };

  if (loading || !currentQuestion) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <ProgressBar
        history={history.map((q) => q.wasCorrect)}
        questions={questions}
      />

      {questions.length ? (
        <div ref={questionRef} className={styles.questionRow} tabIndex={-1}>
          <div>
            <Question text={currentQuestion.question} />
          </div>
        </div>
      ) : null}

      {questions.length ? (
        <div className={styles.alternatives}>
          {currentQuestion.options.map((option) => (
            <Alternative
              key={option}
              text={option}
              type={buttonClass(option)}
              onClick={(): void => answer(option)}
            />
          ))}
        </div>
      ) : null}

      {answerGiven ? (
        <div className={styles.explanationRow}>
          <Explanation text={currentQuestion.explanation} />
          <b role="alert" className={styles.continueTip}>
            Click any answer to continue
          </b>
        </div>
      ) : null}
    </div>
  );
}

export default Questions;
