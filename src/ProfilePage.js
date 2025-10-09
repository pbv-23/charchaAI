import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./ProfilePage.css";

const Profile = () => {
  const [username, setUsername] = useState("Debater");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("darkMode");
    navigate("/login");
  };

  return (
    <div className={`profile-page ${darkMode ? "dark" : "light"}`}>
      <Navbar />

      <div className="profile-container">
        <h1>Welcome, {username}!</h1>
        <p>Your profile details are shown below:</p>

        <div className="profile-options">
          <button onClick={() => navigate("/")}>🏠 Practice Debates</button>
          <button onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
