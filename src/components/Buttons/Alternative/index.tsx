import BaseButton from "../BaseButton";
import MathElement from "../../MathElement";
import { sanitize } from "../../../utils";
import styles from "./Alternative.module.css";

interface Props {
  text: string;
  type: "alternativeMobile" | "alternative" | "correctAnswer" | "wrongAnswer";
  onClick?: (
    event:
      | React.KeyboardEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  children?: JSX.Element | JSX.Element[];
}

/* eslint-disable react/no-danger */
const Alternative = (props: Props): JSX.Element => {
  const text = sanitize(props.text);

  return (
    <BaseButton className={styles[props.type]} onClick={props.onClick} href="">
      <MathElement dangerouslySetInnerHTML={{ __html: text }} />
    </BaseButton>
  );
};

export default Alternative;
