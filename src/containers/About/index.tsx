import styles from "./About.module.css";

const About = (): JSX.Element => (
  <div>
    <div className={styles.about}>
      <h1 className={styles.title}>Cram with Kramster!</h1>
      <p>
        Kramster helps making exam preparation a little more fun. Select your
        school and course and cram for your exam by doing the multiple choice
        questions with instant feedback.
      </p>
      <p>
        Kramster is made by <a href="https://byrkje.land">Mats Byrkjeland</a>{" "}
        and it is{" "}
        <a href="https://github.com/draperunner/Kramster">open source</a>. Do
        you enjoy Kramster? Star it on{" "}
        <a href="https://github.com/draperunner/kramster">GitHub</a>!
      </p>
    </div>
  </div>
);

export const Component = About;
