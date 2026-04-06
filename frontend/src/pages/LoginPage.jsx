import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';

import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login, googleLogin, userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
            setLoading(false);
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            await googleLogin(credentialResponse.credential);
            setLoading(false);
            navigate('/');
        } catch (err) {
            setError('Google login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page animate-fade-in">
            <div className="auth-card glass-morphism">
                <div className="auth-header text-center">
                    <div className="auth-icon-wrapper">
                        <LogIn size={32} color="var(--primary-color)" />
                    </div>
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-alert">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-premium w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <div className="google-login-wrapper">
                        <GoogleLogin 
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            useOneTap
                            theme="filled_black"
                            width="100%"
                        />
                    </div>
                </form>

                <div className="auth-footer text-center">
                    <p>
                        Don't have an account? <Link to="/signup" className="auth-link">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
