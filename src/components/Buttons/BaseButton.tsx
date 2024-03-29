import { Link } from "react-router-dom";

interface Props {
  className?: string;
  href: string;
  onClick?: (
    event:
      | React.KeyboardEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  children?: string | JSX.Element | JSX.Element[];
}

const BaseButton = (props: Props): JSX.Element => (
  <Link
    to={props.href}
    className={props.className}
    onClick={props.onClick}
    onKeyDown={(e) => e.which === 13 && props.onClick && props.onClick(e)}
    role="button"
    type="button"
    tabIndex={0}
  >
    {props.children}
  </Link>
);

export default BaseButton;
