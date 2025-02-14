import { FC, ReactNode } from "react";
import { sanitize } from "../../../utils";
import styles from "./Alternative.module.css";

interface Props {
  text: string;
  type: "alternativeMobile" | "alternative" | "correctAnswer" | "wrongAnswer";
  onClick?: (
    event:
      | React.KeyboardEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => void;
  children?: ReactNode;
}

const Alternative: FC<Props> = (props) => {
  const text = sanitize(props.text);

  return (
    <button
      className={styles[props.type]}
      onClick={props.onClick}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default Alternative;
