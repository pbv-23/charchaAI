// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./ScorePage.css";

// const ScorePage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { topic, messages, humanStance, aiStance, judgedResult } = location.state || {};

//   const [isAnalyzing, setIsAnalyzing] = useState(!judgedResult);
//   const [result, setResult] = useState(judgedResult || null);

// useEffect(() => {
//   let hasJudged = false; // ✅ local flag to block duplicate calls

//   const handleJudge = async () => {
//     // ✅ Prevent multiple API calls
//     if (hasJudged) return;
//     hasJudged = true;

//     // ✅ If judgedResult already exists (from history), skip judging
//     if (judgedResult) {
//       setResult(judgedResult);
//       setIsAnalyzing(false);
//       return;
//     }

//     try {
//       const username = localStorage.getItem("username") || "Human";
//       const res = await fetch("http://localhost:5000/judge", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ topic, messages, humanStance, aiStance, username }),
//       });
//       const data = await res.json();
//       console.log("✅ Final judged result:", data);
//       setResult(data);
//     } catch (err) {
//       console.error("❌ Error analyzing results:", err);
//       setResult({
//         winner: "AI",
//         reason: "Error analyzing, fallback result.",
//       });
//     } finally {
//       setTimeout(() => setIsAnalyzing(false), 1500);
//     }
//   };

//   handleJudge();

//   // ✅ cleanup: if unmounted before completion
//   return () => {
//     hasJudged = true;
//   };
// }, []); // ✅ empty dependency array — runs once only


//   if (isAnalyzing) {
//     return (
//       <div className="score-container">
//         <h2>Analyzing results...</h2>
//       </div>
//     );
//   }

//   if (!result) {
//     return <p>No judged result available for this debate.</p>;
//   }

//   return (
//     <div className="score-container">
//       <h2>🏆 Debate Results for: {topic}</h2>
//       <div className="score-box">
//         <p>
//           <strong>{localStorage.getItem("username") || "Human"} Score:</strong>{" "}
//           {result.humanScore ?? "N/A"}
//         </p>
//         <p><strong>AI Score:</strong> {result.aiScore ?? "N/A"}</p>
//         <p><strong>Winner:</strong> 🏆 {result.winner}</p>
//         <p><strong>Reason:</strong> {result.reason}</p>
//       </div>
//       <button onClick={() => navigate("/")}>Back to Home</button>
//     </div>  
//   );
// };

// export default ScorePage;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ScorePage.css";

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, messages, humanStance, aiStance, judgedResult } = location.state || {};

  const [isAnalyzing, setIsAnalyzing] = useState(!judgedResult);
  const [result, setResult] = useState(judgedResult || null);

  useEffect(() => {
    let hasJudged = false;

    const handleJudge = async () => {
      if (hasJudged) return;
      hasJudged = true;

      // ✅ If judgedResult exists (from history), skip new judging
      if (judgedResult) {
        setResult(judgedResult);
        setIsAnalyzing(false);
        return;
      }

      try {
        const username = localStorage.getItem("username") || "Human";
        const res = await fetch("http://localhost:5000/judge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, messages, humanStance, aiStance, username }),
        });
        const data = await res.json();
        console.log("✅ Final judged result:", data);
        setResult(data);

        // ✅ Save to MongoDB after judging
        const email = localStorage.getItem("email");
        if (email) {
          await fetch("http://localhost:5000/saveDebate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              topic,
              humanStance,
              aiStance,
              messages,
              judgedResult: data, // ✅ store the final judged result
            }),
          });
          console.log("✅ Result successfully saved to MongoDB");
        }
      } catch (err) {
        console.error("❌ Error analyzing results:", err);
        setResult({
          winner: "AI",
          reason: "Error analyzing, fallback result.",
        });
      } finally {
        setTimeout(() => setIsAnalyzing(false), 1500);
      }
    };

    handleJudge();

    return () => {
      hasJudged = true;
    };
  }, []); // ✅ runs once only

  // ✅ When we already have result from props (judgedResult), also store it
  useEffect(() => {
    const saveExistingResult = async () => {
      if (!judgedResult) return;

      const email = localStorage.getItem("email");
      if (!email) return;

      try {
        await fetch("http://localhost:5000/saveDebate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            topic,
            humanStance,
            aiStance,
            messages,
            judgedResult,
          }),
        });
        console.log("✅ Existing judged result saved to MongoDB");
      } catch (err) {
        console.error("❌ Error saving existing judged result:", err);
      }
    };

    saveExistingResult();
  }, [judgedResult]);

  if (isAnalyzing) {
    return (
      <div className="score-container">
        <h2>Analyzing results...</h2>
      </div>
    );
  }

  if (!result) {
    return <p>No judged result available for this debate.</p>;
  }

  return (
    <div className="score-container">
      <h2>🏆 Debate Results for: {topic}</h2>
      <div className="score-box">
        <p>
          <strong>{localStorage.getItem("username") || "Human"} Score:</strong>{" "}
          {result.humanScore ?? "N/A"}
        </p>
        <p><strong>AI Score:</strong> {result.aiScore ?? "N/A"}</p>
        <p><strong>Winner:</strong> 🏆 {result.winner}</p>
        <p><strong>Reason:</strong> {result.reason}</p>
      </div>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default ScorePage;
