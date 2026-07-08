import React, { createContext, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import socketIoClient from 'socket.io-client';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {

  const WS = process.env.REACT_APP_API_URL || 'http://localhost:6001';
  const socket = socketIoClient(WS);

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const login = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await API.post('/login', { email, password });
      const data = res.data;

      localStorage.setItem('userId', data._id);
      localStorage.setItem('usertype', data.usertype);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);

      if (data.usertype === 'freelancer') navigate('/freelancer');
      else if (data.usertype === 'client') navigate('/client');
      else if (data.usertype === 'admin') navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Login failed. Please check your credentials.';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await API.post('/register', { username, email, password, usertype });
      const data = res.data;

      localStorage.setItem('userId', data._id);
      localStorage.setItem('usertype', data.usertype);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);

      if (data.usertype === 'freelancer') navigate('/freelancer');
      else if (data.usertype === 'client') navigate('/client');
      else if (data.usertype === 'admin') navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider value={{
      socket,
      login, register, logout,
      username, setUsername,
      email, setEmail,
      password, setPassword,
      usertype, setUsertype,
      authError, setAuthError,
      authLoading
    }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;