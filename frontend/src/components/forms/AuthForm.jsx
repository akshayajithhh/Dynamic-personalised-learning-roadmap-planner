import React, { useState } from 'react';
import Button from '../ui/Button';

const AuthForm = ({ type, onSubmit, loading, error }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const formGroupStyle = {
        marginBottom: '1.25rem',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500',
        color: 'var(--secondary-black)',
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #d1d5db',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
    };

    return (
        <form onSubmit={handleSubmit}>
            {type === 'register' && (
                <div style={formGroupStyle}>
                    <label style={labelStyle} htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>
            )}

            <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />
            </div>

            <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />
            </div>

            {error && (
                <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
            )}

            <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Processing...' : type === 'login' ? 'Login' : 'create Account'}
            </Button>
        </form>
    );
};

export default AuthForm;
