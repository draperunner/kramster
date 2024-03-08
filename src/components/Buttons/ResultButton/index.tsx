import BaseButton from "../BaseButton";
import styles from "./ResultButton.module.css";

interface Props {
  href: string;
  onClick?: (
    event:
      | React.KeyboardEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  children?: JSX.Element | JSX.Element[];
}

const ResultButton = (props: Props): JSX.Element => (
  <BaseButton {...props} className={styles.result}>
    {props.children}
  </BaseButton>
);

export default ResultButton;
