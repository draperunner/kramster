import React from 'react'
import { Link } from 'react-router'
import './Navbar.css'

const Navbar = () => (
  <nav className="navbar">
    <div className="pullLeft">
      { window.location.pathname !== '/' ? (
        <Link className="logo" to="/" tabIndex={0}>
            Kramster!
        </Link>
      ) : null }
    </div>
    <div className="pullRight">
      <ul>
        <li>
          <Link className="link" to="/about" tabIndex={0}>
              About
          </Link>
        </li>
      </ul>
    </div>
  </nav>
)

export default Navbar
