import React from "react";
import Navbar from "./Navbar"; // import your Navbar
import "./home.css";

const Home = () => {
  return (
    <div className="page-container">
      {/* Add Navbar at the top */}
      <Navbar />

      <main className="cards-container">
        <div className="card">
          <h2>1 vs AI</h2>
        </div>

        <div className="card">
          <h2>Group</h2>
        </div>

        <div className="card">
          <h2>History</h2>
        </div>

        <div className="card">
          <h2>Profile</h2>
        </div>
      </main>
    </div>
  );
};

export default Home;
