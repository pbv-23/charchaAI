// import React from "react";
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import AppInfo from "./AppInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<AppInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // ✅ default export
