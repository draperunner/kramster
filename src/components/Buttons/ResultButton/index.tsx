import React from "react";
import BaseButton from "../BaseButton";
import styles from "./ResultButton.css";

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
