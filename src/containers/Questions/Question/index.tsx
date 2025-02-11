import { sanitize } from "../../../utils";
import styles from "./Question.module.css";

interface Props {
  text: string;
}

const Question = (props: Props): JSX.Element => (
  <p
    className={styles.question}
    dangerouslySetInnerHTML={{ __html: sanitize(props.text) }}
  />
);

export default Question;
