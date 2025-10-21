import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./debate.css";
import { Link } from "react-router-dom";

const Debate = () => {
  const [topic, setTopic] = useState(""); // current topic
  const [loading, setLoading] = useState(true); // track fetch loading
  const [error, setError] = useState(false); // track fetch errors

  // Fetch a random topic from backend
  const fetchRandomTopic = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("http://localhost:5000/topics");
      if (!response.ok) throw new Error("Failed to fetch topics");

      const topics = await response.json();
      if (!Array.isArray(topics) || topics.length === 0) {
        throw new Error("No topics available");
      }

      // Pick a random topic
      const random = topics[Math.floor(Math.random() * topics.length)];
      setTopic(random);
    } catch (err) {
      console.error("Error fetching topic:", err);
      setError(true);
      setTopic(""); // clear previous topic
    } finally {
      setLoading(false);
    }
  };

  // Rescrape topics from backend
  const rescrapeTopics = async () => {
    setLoading(true);
    setError(false);
    try {
      await fetch("http://localhost:5000/rescrape");
      await fetchRandomTopic(); // pick a new topic after rescrape
    } catch (err) {
      console.error("Failed to rescrape:", err);
      setError(true);
      setLoading(false);
    }
  };

  // Handle Start Debate click
  const startDebate = () => {
    alert(`Debate started on topic:\n\n"${topic}"`);
  };

  // Load a random topic on component mount
  useEffect(() => {
    fetchRandomTopic();
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <main className="debate-container">
        <div className="debate-card">
          <h1>1 vs AI Debate</h1>
          <p className="topic-label">Your Debate Topic</p>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading topic...</p>
            </div>
          )}

          {!loading && error && (
            <p className="error">
              Failed to fetch topics. Try refreshing the page or rescrape.
            </p>
          )}

          {!loading && !error && topic && (
            <h2 className="debate-topic">“{topic}”</h2>
          )}

          {!loading && !error && !topic && (
            <p className="info">No topic available. Click ♻️ Rescrape Topics.</p>
          )}

          {/* Buttons */}
          <div className="buttons">
            <button className="shuffle-btn" onClick={fetchRandomTopic} disabled={loading}>
              🔄 Shuffle Topic
            </button>
            <button className="shuffle-btn" onClick={rescrapeTopics} disabled={loading}>
              ♻️ Rescrape Topics
            </button>
          </div>
          <Link to="/debatestart" state={{ topic }}>
            <div className="buttons">
            <button className="start-btn">Start Debate</button>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Debate;
