import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ScorePage.css";

const Score = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, messages, humanStance, aiStance } = location.state || {};

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const handleJudge = async () => {
      try {
        const res = await fetch("http://localhost:5000/judge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, messages, humanStance, aiStance }),
        });
        const data = await res.json();
        console.log("Score API response:", data); // ✅ this logs what backend sends
        setResult(data);
      } catch (err) {
        console.error("Error analyzing results:", err);
        setResult({ winner: "AI", reason: "Error analyzing, fallback result." });
      } finally {
        setTimeout(() => setIsAnalyzing(false), 1500); // small delay for UX
      }
    };

    handleJudge(); // ✅ call the correct function
  }, [topic, messages, humanStance, aiStance]);

  return (
    <div className="score-container">
      {isAnalyzing ? (
        <h2>Analyzing results...</h2>
      ) : (
        <>
          <h2>🏆 Debate Results</h2>
          <p><strong>Human Score:</strong> {result?.humanScore ?? "N/A"}</p>
          <p><strong>AI Score:</strong> {result?.aiScore ?? "N/A"}</p>
          <p><strong>Winner:</strong> {result?.winner}</p>
          <p><strong>Reason:</strong> {result?.reason}</p>

          <button onClick={() => navigate("/")}>Back to Home</button>
        </>
      )}
    </div>
  );
};

export default Score;
