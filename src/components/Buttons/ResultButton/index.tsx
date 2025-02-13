import { FC, ReactNode } from "react";
import BaseButton from "../BaseButton";
import styles from "./ResultButton.module.css";

interface Props {
  href: string;
  onClick?: (
    event:
      | React.KeyboardEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  children?: ReactNode;
}

const ResultButton: FC<Props> = (props) => (
  <BaseButton {...props} className={styles.result}>
    {props.children}
  </BaseButton>
);

export default ResultButton;
