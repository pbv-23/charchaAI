// // src/ProfileCard.jsx
// import React ,{ useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { FaUserCircle, FaClipboardList, FaBook, FaChartLine, FaCoins } from "react-icons/fa";

// const ProfilePage = ({ darkMode }) => {
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     // Get username from localStorage
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) setUsername(storedUsername);
//   }, []); 
//   return (
//     <div className={`profile-card ${darkMode ? "dark" : "light"}`}>
//       <div className="profile-avatar">
//         <FaUserCircle size={60} />
//       </div>
//       {username && <h2 className="profile-username">{username}</h2>}
//       <div className="profile-actions">

//         <Link to="/history" className="profile-item">
//           <FaCoins style={{ marginRight: "8px" }} />
//           History
//         </Link>
// {username ? (
//   <button
//     className="logout-btn"
//     onClick={() => {
//       localStorage.removeItem("username");
//       localStorage.removeItem("email");
//       window.location.href = "/login";
//     }}
//   >
//     Logout
//   </button>
// ) : (
//   <Link to="/login">
//     <button className="logout-btn">Login</button>
//   </Link>
// )}


//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaCoins,
  FaMedal,
} from "react-icons/fa";

const ProfilePage = ({ darkMode }) => {
  const [username, setUsername] = useState("");
  const [points, setPoints] = useState(0);
  const [medal, setMedal] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    const fetchPoints = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;

      try {
        const res = await fetch(`http://localhost:5000/getDebates/${email}`);
        const data = await res.json();
        const totalDebates = data.length;

        // Calculate points pattern
        let totalPoints = 0;
        for (let i = 1; i <= totalDebates; i++) {
          const mod = (i - 1) % 10;
          if (mod === 0 || mod === 5) totalPoints += 100;
          else totalPoints += 50;
        }

        setPoints(totalPoints);

        // Set medal
        if (totalPoints >= 5000) setMedal("gold");
        else if (totalPoints >= 2500) setMedal("silver");
        else if (totalPoints >= 1000) setMedal("bronze");
        else setMedal("");

        // Calculate progress (for next medal)
        const nextLevel =
          totalPoints >= 5000
            ? 5000
            : totalPoints >= 2500
            ? 5000
            : totalPoints >= 1000
            ? 2500
            : 1000;
        setProgress(Math.min((totalPoints / nextLevel) * 100, 100));
      } catch (err) {
        console.error("Error fetching points:", err);
      }
    };

    fetchPoints();
  }, []);

  // Theme colors
  const isDark = darkMode;
  const colors = {
    background: isDark
      ? "linear-gradient(135deg, #1e293b, #0f172a)"
      : "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    card: isDark ? "#1e293b" : "#fff",
    text: isDark ? "#f1f5f9" : "#1e293b",
    barBg: isDark ? "#334155" : "#e2e8f0",
    barFill: "#ef4444", // red
  };

  const medalIcon =
    medal === "gold"
      ? { color: "#FFD700", label: "Gold Medal" }
      : medal === "silver"
      ? { color: "#C0C0C0", label: "Silver Medal" }
      : medal === "bronze"
      ? { color: "#CD7F32", label: "Bronze Medal" }
      : null;

  return (
    <div
      className="profile-card"
      style={{
        background: colors.card,
        color: colors.text,
        borderRadius: "16px",
        padding: "30px",
        boxShadow: isDark
          ? "0 4px 12px rgba(255,255,255,0.1)"
          : "0 4px 12px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        margin: "60px auto",
        textAlign: "center",
      }}
    >
      <div className="profile-avatar">
        <FaUserCircle size={70} />
      </div>
      {username && <h2 style={{ marginTop: "10px" }}>{username}</h2>}

      {/* 🏅 Medal display */}
      {medalIcon && (
        <div style={{ marginTop: "15px", marginBottom: "5px" }}>
          <FaMedal
            size={40}
            color={medalIcon.color}
            title={medalIcon.label}
            style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.3))" }}
          />
          <p style={{ marginTop: "5px", fontWeight: "600" }}>
            {medalIcon.label}
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: "16px",
          background: colors.barBg,
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "10px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: colors.barFill,
            borderRadius: "10px",
            transition: "width 0.5s ease",
          }}
        ></div>
      </div>
      <p style={{ marginTop: "8px", fontSize: "14px" }}>
        Points: <strong>{points}</strong>
      </p>

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
  <Link
    to="/history"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
      color: isDark ? "#f1f5f9" : "#1e293b",
      background: isDark ? "#334155" : "#f1f5f9",
      border: `1px solid ${isDark ? "#475569" : "#cbd5e1"}`,
      padding: "8px 66px",
      borderRadius: "8px",
      fontWeight: 500,
      transition: "all 0.3s ease",
    }}
    onMouseOver={(e) =>
      (e.currentTarget.style.background = isDark ? "#475569" : "#e2e8f0")
    }
    onMouseOut={(e) =>
      (e.currentTarget.style.background = isDark ? "#334155" : "#f1f5f9")
    }
  >
    <FaCoins style={{ marginRight: "8px", color: "#ef4444" }} />
    History
  </Link>
</div>


      {/* Login/Logout */}
      {username ? (
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            window.location.href = "/login";
          }}
          style={{
            marginTop: "15px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      ) : (
        <Link to="/login">
          <button
            style={{
              marginTop: "15px",
              background: "#4b7bec",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </Link>
      )}
    </div>
  );
};

export default ProfilePage;
