// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const HistoryPage = () => {
//   const [history, setHistory] = useState([]);
//   const navigate = useNavigate();
//   const email = localStorage.getItem("email");

//   useEffect(() => {
//   const fetchHistory = async () => {
//     const email = localStorage.getItem("email"); // ✅ consistent key
//     if (!email) return;

//     const res = await fetch(`http://localhost:5000/getDebates/${email}`);
//     const data = await res.json();

//     // ✅ Optional: remove duplicates (by topic + date)
//     const uniqueData = data.filter(
//       (item, index, self) =>
//         index ===
//         self.findIndex(
//           (t) =>
//             t.topic === item.topic &&
//             new Date(t.date).getTime() === new Date(item.date).getTime()
//         )
//     );

//     setHistory(uniqueData);
//   };

//   fetchHistory();
// }, []);



//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #eef2ff, #dfe9f3)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: "40px",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "16px",
//           boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
//           padding: "30px 40px",
//           width: "100%",
//           maxWidth: "700px",
//         }}
//       >
//         <h2
//           style={{
//             textAlign: "center",
//             color: "#2c3e50",
//             fontSize: "30px",
//             marginBottom: "25px",
//             fontWeight: "700",
//             borderBottom: "3px solid #4b7bec",
//             paddingBottom: "10px",
//             textTransform: "uppercase",
//           }}
//         >
//           Debate History
//         </h2>

//         {history.length === 0 ? (
//           <p style={{ textAlign: "center", color: "#777", fontSize: "18px" }}>
//             No debates yet.
//           </p>
//         ) : (
//           <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//             {history.map((debate, index) => (
//               <li key={index}>
//                 <button
//                   style={{
//                     width: "100%",
//                     background: "#f9faff",
//                     border: "2px solid transparent",
//                     borderRadius: "12px",
//                     padding: "18px 20px",
//                     marginBottom: "15px",
//                     textAlign: "left",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease",
//                     boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.border = "2px solid #4b7bec";
//                     e.currentTarget.style.background = "#f1f6ff";
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.border = "2px solid transparent";
//                     e.currentTarget.style.background = "#f9faff";
//                   }}
//                  onClick={() =>
//   navigate("/score", {
//     state: {
//       topic: debate.topic,
//       judgedResult: debate.judgedResult,
//       messages: debate.messages,        // ✅ pass messages
//       humanStance: debate.humanStance,  // ✅ pass stance
//       aiStance: debate.aiStance,        // ✅ pass stance
//     },
//   })
// }


//                 >
//                   <strong
//                     style={{
//                       display: "block",
//                       color: "#4b7bec",
//                       fontSize: "18px",
//                       marginBottom: "5px",
//                     }}
//                   >
//                     {debate.topic}
//                   </strong>
//                   <span
//                     style={{
//                       color: "#555",
//                       fontSize: "14px",
//                     }}
//                   >
//                     {new Date(debate.date).toLocaleString()}
//                   </span>
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HistoryPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HistoryPage = ({ theme = "light" }) => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  // ✅ Theme detection
  const isDark = theme === "dark";
  const colors = {
    background: isDark
      ? "linear-gradient(135deg, #1e293b, #0f172a)"
      : "linear-gradient(135deg, #eef2ff, #dfe9f3)",
    card: isDark ? "#1e293b" : "#fff",
    text: isDark ? "#f8fafc" : "#2c3e50",
    subtext: isDark ? "#cbd5e1" : "#555",
    highlight: "#4b7bec",
  };

  // ✅ Fetch debate history
  useEffect(() => {
    const fetchHistory = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;

      try {
        const res = await fetch(`http://localhost:5000/getDebates/${email}`);
        const data = await res.json();

        // Remove duplicates
        const uniqueData = data.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.topic === item.topic &&
                new Date(t.date).getTime() === new Date(item.date).getTime()
            )
        );

        setHistory(uniqueData);
      } catch (err) {
        console.error("❌ Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        position: "relative",
        transition: "all 0.3s ease",
      }}
    >
      {/* 🔙 Round Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "25px",
          left: "25px",
          background: isDark ? "#1e293b" : "#e2e8f0",
          border: `2px solid ${colors.highlight}`,
          cursor: "pointer",
          color: colors.highlight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "45px",
          height: "45px",
          borderRadius: "50%", // ✅ round shape
          fontSize: "16px",
          transition: "all 0.3s ease",
          boxShadow: isDark
            ? "0 2px 6px rgba(255, 255, 255, 0.1)"
            : "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = colors.highlight;
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.boxShadow =
            "0 0 12px rgba(37, 99, 235, 0.8)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = isDark ? "#1e293b" : "#e2e8f0";
          e.currentTarget.style.color = colors.highlight;
          e.currentTarget.style.boxShadow = isDark
            ? "0 2px 6px rgba(255, 255, 255, 0.1)"
            : "0 2px 6px rgba(0, 0, 0, 0.1)";
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* 🧾 Main Card */}
      <div
        style={{
          background: colors.card,
          borderRadius: "16px",
          boxShadow: isDark
            ? "0 4px 15px rgba(255, 255, 255, 0.1)"
            : "0 4px 15px rgba(0, 0, 0, 0.1)",
          padding: "30px 40px",
          width: "100%",
          maxWidth: "700px",
          color: colors.text,
          transition: "all 0.3s ease",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: colors.text,
            fontSize: "30px",
            marginBottom: "25px",
            fontWeight: "700",
            borderBottom: `3px solid ${colors.highlight}`,
            paddingBottom: "10px",
            textTransform: "uppercase",
          }}
        >
          Debate History
        </h2>

        {/* 🗂️ No History Case */}
        {history.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: colors.subtext,
              fontSize: "18px",
            }}
          >
            No debates yet.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {history.map((debate, index) => (
              <li key={index}>
                <button
                  style={{
                    width: "100%",
                    background: isDark ? "#273349" : "#f9faff",
                    border: "2px solid transparent",
                    borderRadius: "12px",
                    padding: "18px 20px",
                    marginBottom: "15px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: isDark
                      ? "0 2px 6px rgba(255,255,255,0.05)"
                      : "0 2px 6px rgba(0,0,0,0.05)",
                    color: colors.text,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.border = `2px solid ${colors.highlight}`;
                    e.currentTarget.style.background = isDark
                      ? "#334155"
                      : "#f1f6ff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.border = "2px solid transparent";
                    e.currentTarget.style.background = isDark
                      ? "#273349"
                      : "#f9faff";
                  }}
                  onClick={() =>
                    navigate("/score", {
                      state: {
                        topic: debate.topic,
                        judgedResult: debate.judgedResult,
                        messages: debate.messages,
                        humanStance: debate.humanStance,
                        aiStance: debate.aiStance,
                      },
                    })
                  }
                >
                  <strong
                    style={{
                      display: "block",
                      color: colors.highlight,
                      fontSize: "18px",
                      marginBottom: "5px",
                    }}
                  >
                    {debate.topic}
                  </strong>
                  <span style={{ color: colors.subtext, fontSize: "14px" }}>
                    {new Date(debate.date).toLocaleString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
