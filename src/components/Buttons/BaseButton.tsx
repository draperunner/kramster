import { FC, ReactNode } from "react";
import { Link } from "react-router";

interface Props {
  className?: string;
  href: string;
  onClick?: (
    event:
      | React.KeyboardEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  children?: ReactNode;
}

const BaseButton: FC<Props> = (props) => (
  <Link
    to={props.href}
    className={props.className}
    onClick={props.onClick}
    onKeyDown={(e) => e.which === 13 && props.onClick && props.onClick(e)}
    role="button"
    type="button"
    tabIndex={0}
    viewTransition
  >
    {props.children}
  </Link>
);

export default BaseButton;
