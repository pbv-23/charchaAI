import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import AppInfo from "./AppInfo";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<AppInfo />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
