import { FC } from "react";
import styles from "./About.module.css";

const About: FC = () => (
  <div>
    <div className={styles.about}>
      <h1 className={styles.title}>Cram with Kramster!</h1>
      <p>
        Kramster helps making exam preparation a little more fun. Select your
        school and course and cram for your exam by doing the multiple choice
        questions with instant feedback.
      </p>
      <p>
        This is a Progressive Web App (PWA). Add the website to your home screen
        for offline support and a more app-like experience. Cram for your exam
        even without internet!
      </p>
      <p>
        Want to add an exam? It requires some technical skills, but you can do
        this on <a href="https://github.com/draperunner/kramster">GitHub</a>.
        Create a JSON file for your exam on the expected format and submit a
        pull request.
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
