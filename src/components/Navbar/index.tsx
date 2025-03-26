import { Link, useLocation } from "react-router";
import styles from "./Navbar.module.css";
import { FC } from "react";

const Navbar: FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.pullLeft}>
        {location.pathname !== "/" ? (
          <Link className={styles.logo} to="/" tabIndex={0} viewTransition>
            Kramster!
          </Link>
        ) : null}
      </div>
      <div className={styles.pullRight}>
        <ul>
          <li>
            <Link
              className={styles.link}
              to="/about"
              tabIndex={0}
              viewTransition
            >
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
