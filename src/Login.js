import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post("http://localhost:5000/login", {
  //       email,
  //       password,
  //     });
  //     alert(res.data.message);
  //     localStorage.setItem("username", res.data.username);
  //     navigate("/");
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Login failed");
  //   }
  // };

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/login", {
      email,
      password,
    });

    // ✅ Store both username and email
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("email", email);

    // ✅ Optional: show a quick success toast or message
    console.log("Login successful:", res.data.message);

    // ✅ Redirect directly to home page
    navigate("/");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="login-container">
      <button className="back-circle" onClick={() => navigate(-1)}>←</button>
      <form onSubmit={handleLogin} className="login-form">
        <h1>Login</h1>
        <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        <p>Don't have an account? <span onClick={() => navigate("/signup")} style={{ color: "blue", cursor: "pointer" }}>Sign up</span></p>
      </form>
    </div>
  );
};

export default Login;
