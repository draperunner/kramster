import styles from "./ProgressBar.module.css";
import { Question } from "../../interfaces";
import { FC } from "react";

interface Props {
  history: boolean[];
  questions: Question[];
}

const ProgressBar: FC<Props> = (props) => {
  const value =
    props.questions.length > 0
      ? Math.round((100 * props.history.length) / props.questions.length)
      : 0;

  const itemWidth =
    props.questions.length > 0 ? 100 / props.questions.length : 0;

  const type = (index: number): "correct" | "wrong" =>
    props.history[index] ? "correct" : "wrong";

  return (
    <div
      role="progressbar"
      aria-label="Progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <p className={styles.progressText}>
        {`${props.history.length}/${props.questions.length}`}
      </p>
      <div className={styles.progress}>
        {props.history.map((_answer, i) => (
          <div
            key={i}
            className={styles[type(i)]}
            style={{ width: `${itemWidth}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
