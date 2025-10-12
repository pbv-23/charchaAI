import React from "react";
import Navbar from "./Navbar";
import "./appinfo.css";

const AppInfo = () => {
  return (
    <div className="page-container">
      <Navbar />
      <main className="info-container">
        <div className="info-card">
          <h1>About CharchaAI</h1>
          <p>
            <strong>CharchaAI</strong> is an interactive AI-powered platform
            designed to enhance collaborative discussions and intelligent
            conversations.
          </p>

          <h2>Key Features</h2>
          <ul>
            <li>🤖 1 vs AI – Chat one-on-one with our AI assistant.</li>
            <li>👥 Group Mode – Engage in multi-user discussions powered by AI.</li>
            <li>📜 History – Review your past conversations anytime.</li>
            <li>👤 Profile – Manage your personal preferences and activity.</li>
          </ul>

          <h2>Version Info</h2>
          <p>Version: <strong>1.0.0</strong></p>
          <p>Developed by Team CharchaAI © 2025</p>
        </div>
      </main>
    </div>
  );
};

export default AppInfo;