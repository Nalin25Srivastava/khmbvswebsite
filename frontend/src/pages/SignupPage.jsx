import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, Loader2, AlertCircle } from 'lucide-react';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { signup, userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        setError(null);
        try {
            await signup(name, email, password);
            setLoading(false);
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page animate-fade-in">
            <div className="auth-card glass-morphism">
                <div className="auth-header text-center">
                    <div className="auth-icon-wrapper">
                        <UserPlus size={32} color="var(--primary-color)" />
                    </div>
                    <h2>Join Us</h2>
                    <p>Create your account and discover premium products.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-alert">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Write your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-premium w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer text-center">
                    <p>
                        Already have an account? <Link to="/login" className="auth-link">Login Now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
