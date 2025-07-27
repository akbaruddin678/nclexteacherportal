import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'; // 👁️ icons
import './Login.css';
import illustration from '../../../public/illustration.svg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    let role = null;
    if (email === 'admin@lms.com' && password === 'admin') {
      role = 'superadmin';
    } else if (email === 'coord@lms.com' && password === 'coord') {
      role = 'coordinator';
    } else if (email === 'teacher@lms.com' && password === 'teacher') {
      role = 'teacher';
    }

    if (role) {
      navigate(`/${role}/dashboard`);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={illustration} alt="Digital Learning" className="illustration" />
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  top:"21px"
                }}
              >
                {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
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
