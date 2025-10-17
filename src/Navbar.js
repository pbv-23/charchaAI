import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import {
  FaMoon,
  FaSun,
  FaUserCircle,
  FaScroll,
  FaInfoCircle,
} from "react-icons/fa";
import logo from "./assets/download.png";
import ProfilePage from "./ProfilePage";

const Navbar = () => {
  // ✅ Load theme from localStorage or default to dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "light" ? false : true
  );
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // ✅ Apply theme class on mount and whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // ✅ Close profile when clicked outside
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
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="CharchaAI Logo" className="logo-img" />
        </Link>
        <h1>CharchaAI</h1>
      </div>

      {/* Right-side Icons */}
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

        <button
          className="icon-btn"
          onClick={() => setShowProfile(!showProfile)}
        >
          <FaUserCircle />
        </button>

        {/* ✅ ProfilePage always gets correct theme */}
        {showProfile && <ProfilePage darkMode={darkMode} />}
      </div>
    </nav>
  );
};

export default Navbar;
