import React, { useState } from "react";
import { Link } from "react-router-dom"; // import Link
import "./Navbar.css";
import { FaMoon, FaSun, FaUserCircle, FaScroll, FaInfoCircle } from "react-icons/fa";
import darkLogo from "./assets/logo.png";
import lightLogo from "./assets/logo2.png";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("light-theme");
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={darkMode ? darkLogo : lightLogo} // change logo based on theme
            alt="CharchaAI Logo"
            className="logo-img"
          />
        </Link>
        <h1>CharchaAI</h1>
      </div>

      {/* Right side buttons */}
      <div className="navbar-actions">
        <button className="icon-btn" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="icon-btn">
          <FaScroll/>
        </button>

        <button className="icon-btn">
          <FaInfoCircle />
        </button>

        <button className="icon-btn">
          <FaUserCircle/>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
