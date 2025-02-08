import { sanitize } from "../../../utils";
import styles from "./Explanation.module.css";

interface Props {
  text?: string;
}

const Explanation = (props: Props): JSX.Element | null => {
  if (!props.text) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.header}>Explanation</h3>
      <h4
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: sanitize(props.text) }}
      />
    </div>
  );
};

export default Explanation;
