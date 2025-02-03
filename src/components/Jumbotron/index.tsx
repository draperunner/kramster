import styles from "./Jumbotron.module.css";

import DivChart from "../DivChart";

const randomChartData = new Array(6).fill(0).map((_, i) => ({
  label: String.fromCharCode(65 + i),
  value: Math.random(),
}));

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
      <DivChart height={370} data={randomChartData} />
      <p className={styles.subtitle}>{subtitle()}</p>
    </div>
  );
};

export default Jumbotron;
