import React from 'react';
import { Link } from 'react-router';
import styles from './Navbar.css';

const Navbar = () => (
  <div className={`container ${styles.wrapper}`}>
    <nav className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header pull-left">
          { window.location.pathname !== '/' ?
            <Link className={`navbar-brand ${styles.logo}`} to="/">Kramster!</Link>
          : null }
        </div>
        <div className="navbar-header pull-right">
          <ul className={`nav navbar-nav ${styles.links}`}>
            <li><Link className={styles.link} to="/about">About</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
);

export default Navbar;
