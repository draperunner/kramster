import React from 'react';
import { Link } from 'react-router';
import styles from './Navbar.css';

const Navbar = () => (
  <nav className={styles.navbar}>
    <div className={styles.pullLeft}>
      { window.location.pathname !== '/' ?
        <Link className={styles.logo} to="/" tabIndex={0}>Kramster!</Link>
          : null }
    </div>
    <div className={styles.pullRight}>
      <ul>
        <li><Link className={styles.link} to="/about" tabIndex={0}>About</Link></li>
      </ul>
    </div>
  </nav>
);

export default Navbar;
