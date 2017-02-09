import React from 'react';
import { Link } from 'react-router';

const Navbar = () => (
  <div className="container">
    <nav className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header pull-left">
          <Link className="navbar-brand" to="/">Kramster!</Link>
        </div>
        <div className="navbar-header pull-right">
          <ul className="nav navbar-nav">
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
);

export default Navbar;
