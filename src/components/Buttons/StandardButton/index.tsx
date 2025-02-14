import { FC, ReactNode } from "react";
import BaseButton from "../BaseButton";
import styles from "./StandardButton.module.css";

interface Props {
  href: string;
  onClick?: (
    event:
      | React.KeyboardEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  children?: ReactNode;
}

const StandardButton: FC<Props> = (props) => (
  <BaseButton {...props} className={styles.standard}>
    {props.children}
  </BaseButton>
);

export default StandardButton;
