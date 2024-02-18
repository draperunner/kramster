import React from "react";
import BaseButton from "../BaseButton";
import styles from "./StandardButton.css";

interface Props {
  href: string;
  onClick?: (
    event:
      | React.KeyboardEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  children?: string | JSX.Element | JSX.Element[];
}

const StandardButton = (props: Props): JSX.Element => (
  <BaseButton {...props} className={styles.standard}>
    {props.children}
  </BaseButton>
);

export default StandardButton;
