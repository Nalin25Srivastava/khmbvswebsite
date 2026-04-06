import React from 'react';
import API from '../api/api';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = React.useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );

  const login = async (email, password) => {
    const { data } = await API.post('/api/auth/login', { email, password });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const signup = async (name, email, password) => {
    const { data } = await API.post('/api/auth/register', { name, email, password });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const googleLoginHandler = async (idToken) => {
    const { data } = await API.post('/api/auth/google', { idToken });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, signup, logout, googleLogin: googleLoginHandler }}>
      {children}
    </AuthContext.Provider>
  );
};
