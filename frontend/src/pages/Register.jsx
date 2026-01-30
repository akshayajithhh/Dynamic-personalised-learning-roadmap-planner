import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AuthForm from '../components/forms/AuthForm';
import { useUser } from '../context/UserContext';

const Register = () => {
    const { register } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const success = await register(data.name, data.email, data.password);
            setLoading(false);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Registration failed. Try again.');
            }
        } catch (err) {
            setLoading(false);
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <Layout>
            <div className="container">
                <div style={{ maxWidth: '400px', margin: '2rem auto' }} className="card">
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                    <AuthForm type="register" onSubmit={handleRegister} loading={loading} error={error} />
                    <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>Login</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
