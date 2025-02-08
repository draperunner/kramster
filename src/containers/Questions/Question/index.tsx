import { sanitize } from "../../../utils";
import styles from "./Question.module.css";

interface Props {
  text: string;
}

const Question = (props: Props): JSX.Element => (
  <h1
    className={styles.question}
    dangerouslySetInnerHTML={{ __html: sanitize(props.text) }}
  />
);

export default Question;
