import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signup", {
        username,
        email,
        password,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <button className="back-circle" onClick={() => navigate(-1)}>←</button>
      <form onSubmit={handleSignup} className="login-form">
        <h1>Sign Up</h1>
        <input type="text" placeholder="Create Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
