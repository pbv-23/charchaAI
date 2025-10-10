import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import ProfilePage from "./ProfilePage";
import Login from "./Login";
import AppInfo from "./AppInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/info" element={<AppInfo />} /> {/* 👈 add this */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
