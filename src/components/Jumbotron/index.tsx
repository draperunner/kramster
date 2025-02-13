import styles from "./Jumbotron.module.css";

import DivChart from "../DivChart";

const Jumbotron: React.FC = () => {
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
      <DivChart />
      <p className={styles.subtitle}>{subtitle()}</p>
    </div>
  );
};

export default Jumbotron;
