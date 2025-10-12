import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaMoon, FaSun, FaUserCircle, FaScroll, FaInfoCircle,FaClipboardList,FaBook,FaChartLine,FaCoins } from "react-icons/fa";
import darkLogo from "./assets/logo.png";
import lightLogo from "./assets/logo2.png";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("light-theme");
  };

  // Close profile card if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={darkMode ? darkLogo : lightLogo}
            alt="CharchaAI Logo"
            className="logo-img"
          />
        </Link>
        <h1>CharchaAI</h1>
      </div>

      {/* Right side buttons */}
      <div className="navbar-actions" ref={profileRef}>
        <button className="icon-btn" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="icon-btn">
          <FaScroll />
        </button>

        <Link to="/info">
          <button className="icon-btn">
            <FaInfoCircle />
          </button>
        </Link>

        <button className="icon-btn" onClick={() => setShowProfile(!showProfile)}>
          <FaUserCircle />
        </button>

        {/* Profile Card */}
        {showProfile && (
          <div className={`profile-card ${darkMode ? "dark" : "light"}`}>
            <div className="profile-avatar">
              <FaUserCircle size={60} />
            </div>
            <div className="profile-actions">
              <Link to="/lists" className="profile-item">
                  <FaClipboardList style={{ marginRight: "8px" }} />
                  My Lists
                </Link>

                <Link to="/notebook" className="profile-item">
                  <FaBook style={{ marginRight: "8px" }} />
                  Notebook
                </Link>

                <Link to="/progress" className="profile-item">
                  <FaChartLine style={{ marginRight: "8px" }} />
                  Progress
                </Link>

                <Link to="/points" className="profile-item">
                  <FaCoins style={{ marginRight: "8px" }} />
                  Points
                </Link>
              <button className="logout-btn">LogIn</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
