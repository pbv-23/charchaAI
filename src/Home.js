import React from "react";
import Navbar from "./Navbar";
import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="page-container">
      <Navbar />
      <main className="cards-container">
      <Link to="/debate1">
        <div className="card">
          <h2>1 vs AI</h2>
        </div>
      </Link>

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
