// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import illustration from '../../../public/illustration.svg'; // Put your image here

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Role detection logic
    let role = null;
    if (email === 'admin@example.com' && password === '123456') {
      role = 'superadmin';
    } else if (email === 'coordinator@example.com' && password === '123456') {
      role = 'coordinator';
    } else if (email === 'teacher@example.com' && password === '123456') {
      role = 'teacher';
    }

    if (role) {
      // 🔐 Optional: store login session
      // localStorage.setItem('userRole', role);
      navigate(`/${role}/dashboard`);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      {/* Left side */}
      <div className="login-left">
        <img src={illustration} alt="Digital Learning" className="illustration" />
        <h2 className="tagline">Empowering minds through digital learning!</h2>
        <div className="social-icons">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-whatsapp"></i>
          <i className="fab fa-instagram"></i>
        </div>
      </div>

      {/* Right side */}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)}>👁️</span>
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
