import styles from "./Jumbotron.module.css";

import { Grade } from "../../interfaces";
import DivChart from "../DivChart";

interface Props {
  gradesData?: {
    [grade in Grade]: number;
  };
}

const Jumbotron = (props: Props): JSX.Element => {
  const subtitle = (): string => {
    const subtitles = [
      "Will you improve the statistics?",
      "Where are you on the chart?",
      "It's OK to fail.",
      "Practice makes perfect.",
      "You'll do great!",
      "Remember, grades aren't everything.",
      "Cram with Kramster!",
    ];

    return subtitles[Math.floor(Math.random() * subtitles.length)];
  };

  return (
    <div className={styles.jumbotron}>
      <h1 className={styles.title}>Kramster!</h1>
      {props.gradesData ? (
        <DivChart
          height={370}
          data={Object.keys(props.gradesData)
            .sort()
            .reverse()
            .map((label) => ({
              label,
              value: props.gradesData?.[label as Grade] || 0,
            }))}
        />
      ) : null}
      <p className={styles.subtitle}>{subtitle()}</p>
    </div>
  );
};

export default Jumbotron;
