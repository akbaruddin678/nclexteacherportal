import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
import illustration from "../../../public/illustration.svg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img
          src={illustration}
          alt="Digital Learning"
          className="illustration"
        />
        <h2 className="tagline">Empowering minds through digital learning!</h2>
        <div className="social-icons">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-whatsapp"></i>
          <i className="fab fa-instagram"></i>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p>Login into your Account</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Username/Email</label>
            <input
              type="email"
              placeholder="Enter your Username/Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  top: "21px",
                }}
              >
                {showPassword ? (
                  <MdVisibilityOff size={22} />
                ) : (
                  <MdVisibility size={22} />
                )}
              </span>
            </div>

            <div className="forgot-password">
              <a href="#">Forget password?</a>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
