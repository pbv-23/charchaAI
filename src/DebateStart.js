import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./debateStart.css";

const DebateStart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic || "No Topic";

  const [showHuman, setShowHuman] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [humanPosition, setHumanPosition] = useState("center-position");
  const [humanSize, setHumanSize] = useState("small");
  const [humanStance, setHumanStance] = useState("");
  const [aiStance, setAiStance] = useState("");
  const [showStartButton, setShowStartButton] = useState(false);
 

  useEffect(() => {
    const stance = Math.random() < 0.5 ? "Support" : "Oppose";
    setHumanStance(stance);
    setAiStance(stance === "Support" ? "Oppose" : "Support");

    setShowHuman(true);
    const timer1 = setTimeout(() => setHumanSize("large"), 500);
    const timer2 = setTimeout(() => {
      setHumanPosition("left-position");
      setHumanSize("normal");
      setShowAI(true);
    }, 2000);
    const timer3 = setTimeout(() => setShowStartButton(true), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <button className="back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="debate-page-wrapper">
        <h2 className="debate-topic-heading">Topic: {topic}</h2>

        <div className="cards-container-wrapper">
          {showHuman && (
            <div className={`human-card ${humanPosition} ${humanSize}`}>
              <div className="card-name">Human</div>
              <div className="card-emoji">🧑</div>
              <div className="card-stance">{humanStance}</div>
            </div>
          )}

          {showAI && (
            <div className="ai-card right-position">
              <div className="card-name">AI</div>
              <div className="card-emoji">🤖</div>
              <div className="card-stance">{aiStance}</div>
            </div>
          )}

          {showStartButton && (
            <button
              className="start-debate-btn"
              onClick={() =>
                navigate("/debatelive", {
                  state: {
                    topic,
                    aiStance,
                    humanStance,
                  },
                })
              }
            >
              Start Debate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebateStart;
