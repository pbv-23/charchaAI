import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./debateStart.css";

const DebateLive = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic || "No Topic";
  const aiStance = location.state?.aiStance || "Oppose";
  const humanStance = location.state?.humanStance || "Support";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [turn, setTurn] = useState("Human");
  const [isTyping, setIsTyping] = useState(false);
  const [showEndButtons, setShowEndButtons] = useState(false);
  const [debateEnded, setDebateEnded] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (msg) => {
  // Handle both cases: triggered by Enter key or manual click
  let messageText = "";

  if (typeof msg === "string") {
    messageText = msg;
  } else if (typeof msg === "object" && msg?.target?.value) {
    messageText = msg.target.value;
  } else {
    messageText = input;
  }

  if (!messageText || typeof messageText !== "string" || !messageText.trim()) return;

  const newMsg = { sender: turn, text: messageText.trim() };
  setMessages((prev) => [...prev, newMsg]);
  setInput("");

  if (turn === "Human") {
    setTurn("AI");
    setIsTyping(true);

    const aiReply = await fetchAIResponse(messageText);
    setMessages((prev) => {
      const updated = [...prev, { sender: "AI", text: aiReply }];
      if (updated.length % 10 === 0) {
        setShowEndButtons(true);
      }
      return updated;
    });

    setIsTyping(false);
    setTurn("Human");
  }
};


  const fetchAIResponse = async (humanMsg) => {
    try {
      const res = await fetch("http://localhost:5000/debate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, humanMsg, aiStance }),
      });
      const data = await res.json();
      if (data.warning) console.warn(data.warning);
      return data.reply || "Hmm, that’s an interesting argument.";
    } catch (err) {
      console.error("Fetch error:", err);
      return "⚠️ Error fetching AI reply. Using fallback: AI says, 'Interesting perspective.'";
    }
  };

  const handleEndDebate = () => {
    // Add AI closing line
    setMessages((prev) => [
      ...prev,
      { sender: "AI", text: "The debate has ended. Let's view the results!" },
    ]);

    // Mark debate as ended
    setDebateEnded(true);
    setShowEndButtons(false);
  };

  const handleContinueDebate = () => {
    setShowEndButtons(false);
  };

  return (
    <div className="page-container">
      <div className="debate-page-wrapper">
        <h2 className="debate-topic-heading">Topic: {topic}</h2>
        <h4>
          Human: {humanStance} | AI: {aiStance}
        </h4>

        <div className="chat-box" ref={chatRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "Human" ? "human-msg" : "ai-msg"}`}
            >
              <strong>{msg.sender}: </strong> {msg.text}
            </div>
          ))}
          {isTyping && <div className="ai-typing">🤖 AI is typing...</div>}
        </div>

        {/* Main logic section */}
        <div className="input-section">
          {!debateEnded ? (
            <>
              {/* Show send + end debate normally */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={turn !== "Human" || isTyping}
                placeholder={
                  turn === "Human"
                    ? "Type your argument..."
                    : "Wait for AI to respond..."
                }
              />
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={turn !== "Human" || isTyping}
              >
                Send
              </button>

              {/* Show end buttons if debate reached threshold */}
              {showEndButtons && (
                <div className="end-buttons-section">
                  <button className="end-debate-btn" onClick={handleEndDebate}>
                    End Debate
                  </button>
                  <button
                    className="continue-debate-btn"
                    onClick={handleContinueDebate}
                  >
                    Continue Debate
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* After debate ends, only show this */}
              <button
                className="score-btn"
                onClick={() =>
                  navigate("/score", {
                    state: { topic, messages, humanStance, aiStance },
                  })
                }
              >
                View Score
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebateLive;
