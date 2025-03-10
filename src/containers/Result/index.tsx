import { useParams } from "react-router";

import { formatPercentage, percentageToGrade, COLORS } from "../../utils";
import { Kitem } from "../../components";
import { useHistory } from "../../hooks/contexts";
import ResultButton from "../../components/Buttons/ResultButton";
import { HistoryEntry } from "../../interfaces";

import styles from "./Result.module.css";

function Result() {
  const { school, course, exam, number } = useParams();

  const [history] = useHistory();

  const score = history.filter((q: HistoryEntry) => q.wasCorrect).length;
  const percentage = formatPercentage(score, history.length);
  const grade = percentageToGrade(percentage);

  const colorFromUser = COLORS[grade];

  return (
    <div>
      <h1 className={styles.header}>Your results</h1>
      <div className={styles.row}>
        <div>
          <Kitem head={grade} body="Grade" color={colorFromUser} />
        </div>

        <div>
          <Kitem head={score} body="Score" color={colorFromUser} />
        </div>

        <div>
          <Kitem head={percentage} body="%" color={colorFromUser} />
        </div>
      </div>

      <div className={styles.buttons}>
        <ResultButton
          href={"/" + [school, course, exam, number].filter(Boolean).join("/")}
        >
          Try again
        </ResultButton>
        <ResultButton href={`/${school}/${course}`}>Try another</ResultButton>
      </div>
    </div>
  );
}

export const Component = Result;
