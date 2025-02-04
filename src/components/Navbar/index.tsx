import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { FC } from "react";

const Navbar: FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.pullLeft}>
        {location.pathname !== "/" ? (
          <Link className={styles.logo} to="/" tabIndex={0}>
            Kramster!
          </Link>
        ) : null}
      </div>
      <div className={styles.pullRight}>
        <ul>
          <li>
            <Link className={styles.link} to="/about" tabIndex={0}>
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
