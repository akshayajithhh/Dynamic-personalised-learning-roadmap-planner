import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AuthForm from '../components/forms/AuthForm';
import { useUser } from '../context/UserContext';

const Login = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (data) => {
        setLoading(true);
        setError(null);
        const success = await login(data.email, data.password);
        setLoading(false);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <Layout>
            <div className="container">
                <div style={{ maxWidth: '400px', margin: '2rem auto' }} className="card">
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
                    <AuthForm type="login" onSubmit={handleLogin} loading={loading} error={error} />
                    <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>Register</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
