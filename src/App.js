import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import AppInfo from "./AppInfo";
import Login from "./Login";
import Debate from "./Debate";
import DebateStart from "./DebateStart";
import DebateLive from "./DebateLive";
import ScorePage from "./ScorePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<AppInfo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/debate1" element={<Debate />} />
        <Route path="/debatestart" element={<DebateStart />} />
        <Route path="/debatelive" element={<DebateLive />} />
        <Route path="/score" element={<ScorePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
