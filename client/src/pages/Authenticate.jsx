import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import { GeneralContext } from '../context/GeneralContext';
import '../styles/authenticate.css';
import '../components/Auth.css';

const Authenticate = () => {
  const [authType, setAuthType] = useState('login');
  const navigate = useNavigate();
  const { setAuthError } = useContext(GeneralContext);

  const switchType = (type) => {
    setAuthType(type);
    setAuthError('');
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <button className="auth-logo" onClick={() => navigate('/')}>
            <span className="landing-logo-mark">N</span>
            <span className="landing-logo-text">NextGig</span>
          </button>
          <div className="auth-left-body">
            <h2>The platform where <span className="gradient-text">talent meets opportunity</span></h2>
            <p>
              Join thousands of freelancers and clients who trust NextGig to connect,
              collaborate, and create amazing work together.
            </p>
            <div className="auth-left-features">
              {[
                { icon: '🚀', text: 'Post projects in under 2 minutes' },
                { icon: '🤝', text: 'Connect with verified freelancers' },
                { icon: '💬', text: 'Real-time chat & collaboration' },
                { icon: '💰', text: 'Secure, milestone-based payments' },
              ].map((f, i) => (
                <div key={i} className="auth-feature">
                  <span className="auth-feature-icon">{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="auth-left-footer">© 2024 NextGig · All rights reserved</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          {/* Tab Switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab${authType === 'login' ? ' auth-tab--active' : ''}`}
              onClick={() => switchType('login')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab${authType === 'register' ? ' auth-tab--active' : ''}`}
              onClick={() => switchType('register')}
            >
              Create Account
            </button>
          </div>

          {authType === 'login'
            ? <Login setAuthType={switchType} />
            : <Register setAuthType={switchType} />
          }
        </div>
      </div>
    </div>
  );
};

export default Authenticate;