// src/ProfileCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaClipboardList, FaBook, FaChartLine, FaCoins } from "react-icons/fa";

const ProfilePage = ({ darkMode }) => {
  return (
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
        <Link to="/login">
           <button className="logout-btn">LogIn</button>
        </Link>

      </div>
    </div>
  );
};

export default ProfilePage;
