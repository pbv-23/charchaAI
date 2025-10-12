import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaUserCircle,
  FaScroll,
  FaInfoCircle,
  FaClipboardList,
  FaBook,
  FaChartLine,
  FaCoins,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "./assets/download.png";
import "./Navbar.css";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [username, setUsername] = useState("User");
  const menuRef = useRef();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply dark/light mode
  useEffect(() => {
    document.body.classList.toggle("light-theme", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const toggleProfileMenu = () => setShowProfileMenu((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      {/* Left logo + name */}
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={logo}
            alt="AI Debate Partner Logo"
            className="logo-img"
          />
        </Link>
        <h1>AI Debate Partner</h1>
      </div>

      {/* Right side icons */}
      <div className="navbar-actions">
        {/* Theme Toggle in Navbar */}
        <button className="icon-btn" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="icon-btn">
          <FaScroll />
        </button>

        <Link to="/info" className="icon-btn">
          <FaInfoCircle />
        </Link>


        {/* Profile Menu */}
        <div className="profile-menu-wrapper" ref={menuRef}>
          <button className="icon-btn" onClick={toggleProfileMenu}>
            <FaUserCircle />
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-header">
                <div className="profile-avatar">
                  <FaUserCircle size={45} />
                </div>
                <div className="profile-name">
                  <strong>{username}</strong>
                  <p>Welcome back!</p>
                </div>
              </div>

              <div className="profile-options">
                <p className="theme-status">
                  Current Theme:{" "}
                  <span className="theme-name">
                    {darkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </p>

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
              </div>

              <hr style={{ borderColor: "#333", margin: "10px 0" }} />

              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt style={{ marginRight: "8px" }} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
