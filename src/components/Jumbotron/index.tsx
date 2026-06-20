import styles from "./Jumbotron.module.css";

import DivChart from "../DivChart";

const SUBTITLES = [
  "Will you improve the statistics?",
  "Where are you on the chart?",
  "It's OK to fail.",
  "Practice makes perfect.",
  "You'll do great!",
  "Remember, grades aren't everything.",
  "Cram with Kramster!",
];

function randomSubtitle(): string {
  return SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)];
}

const Jumbotron: React.FC = () => {
  return (
    <div className={styles.jumbotron}>
      <h1 className={styles.title}>Kramster!</h1>
      <DivChart />
      <p className={styles.subtitle}>{randomSubtitle()}</p>
    </div>
  );
};

export default Jumbotron;
