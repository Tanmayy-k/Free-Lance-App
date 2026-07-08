import React, { useContext, useState } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import './Auth.css';

const Register = ({ setAuthType }) => {
  const { setUsername, setEmail, setPassword, setUsertype, register, authError, authLoading } = useContext(GeneralContext);
  const [selectedRole, setSelectedRole] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    await register();
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setUsertype(role);
  };

  return (
    <form className="auth-form" onSubmit={handleRegister} noValidate>
      <div className="auth-form-header">
        <h2>Create your account</h2>
        <p>Join NextGig and start building today</p>
      </div>

      {authError && (
        <div className="error-message" role="alert">
          <span>⚠</span> {authError}
        </div>
      )}

      {/* Role Selection */}
      <div className="form-group">
        <label className="form-label">I want to</label>
        <div className="role-cards">
          <div
            className={`role-card${selectedRole === 'freelancer' ? ' role-card--active' : ''}`}
            onClick={() => handleRoleSelect('freelancer')}
          >
            <span className="role-icon">🚀</span>
            <div>
              <div className="role-title">Work as Freelancer</div>
              <div className="role-desc">Find projects & earn</div>
            </div>
          </div>
          <div
            className={`role-card${selectedRole === 'client' ? ' role-card--active' : ''}`}
            onClick={() => handleRoleSelect('client')}
          >
            <span className="role-icon">🏢</span>
            <div>
              <div className="role-title">Hire Freelancers</div>
              <div className="role-desc">Post projects & grow</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-username">Username</label>
        <input
          type="text"
          id="reg-username"
          className="form-input"
          placeholder="Choose a username"
          autoComplete="username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-email">Email address</label>
        <input
          type="email"
          id="reg-email"
          className="form-input"
          placeholder="you@example.com"
          autoComplete="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-password">Password</label>
        <div className="input-with-action">
          <input
            type={showPass ? 'text' : 'password'}
            id="reg-password"
            className="form-input"
            placeholder="Create a strong password"
            autoComplete="new-password"
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
        disabled={authLoading || !selectedRole}
      >
        {authLoading ? <><span className="spinner" />Creating account...</> : 'Create Account'}
      </button>

      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" className="auth-switch-btn" onClick={() => setAuthType('login')}>
          Sign in
        </button>
      </p>
    </form>
  );
};

export default Register;