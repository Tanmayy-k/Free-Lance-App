import React, { useContext, useState } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import './Auth.css';

const Login = ({ setAuthType }) => {
  const { setEmail, setPassword, login, authError, authLoading } = useContext(GeneralContext);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
    <form className="auth-form" onSubmit={handleLogin} noValidate>
      <div className="auth-form-header">
        <h2>Welcome back</h2>
        <p>Sign in to your NextGig account</p>
      </div>

      {authError && (
        <div className="error-message" role="alert">
          <span>⚠</span> {authError}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="login-email">Email address</label>
        <input
          type="email"
          id="login-email"
          className="form-input"
          placeholder="you@example.com"
          autoComplete="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="login-password">Password</label>
        <div className="input-with-action">
          <input
            type={showPass ? 'text' : 'password'}
            id="login-password"
            className="form-input"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="input-action-btn"
            onClick={() => setShowPass(!showPass)}
            tabIndex={-1}
          >
            {showPass ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%' }}
        disabled={authLoading}
      >
        {authLoading ? <><span className="spinner" />Signing in...</> : 'Sign In'}
      </button>

      <p className="auth-switch">
        Don't have an account?{' '}
        <button type="button" className="auth-switch-btn" onClick={() => setAuthType('register')}>
          Create one free
        </button>
      </p>
    </form>
  );
};

export default Login;