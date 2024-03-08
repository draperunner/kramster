import { MathElement } from "../../../components";
import { sanitize } from "../../../utils";
import styles from "./Question.module.css";

/* eslint-disable react/no-danger */

interface Props {
  text: string;
}

const Question = (props: Props): JSX.Element => (
  <MathElement>
    <h3
      className={styles.question}
      dangerouslySetInnerHTML={{ __html: sanitize(props.text) }}
    />
  </MathElement>
);

export default Question;
