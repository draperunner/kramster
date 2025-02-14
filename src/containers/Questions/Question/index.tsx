import { FC } from "react";
import { sanitize } from "../../../utils";
import styles from "./Question.module.css";

interface Props {
  text: string;
}

const Question: FC<Props> = (props) => (
  <p
    className={styles.question}
    dangerouslySetInnerHTML={{ __html: sanitize(props.text) }}
  />
);

export default Question;
