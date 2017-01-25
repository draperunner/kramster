import React from 'react';

const Navbar = () => (
  <div className="container">
    <nav className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header pull-left">
          <a className="navbar-brand" href="/">Kramster!</a>
        </div>
        <div className="navbar-header pull-right">
          <ul className="nav navbar-nav">
            <li><a href="/about">About</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
);

export default Navbar;
