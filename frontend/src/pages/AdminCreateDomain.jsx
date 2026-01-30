import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { createDomain } from '../services/api';

const AdminCreateDomain = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '',
        technologies: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const technologiesArray = formData.technologies
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            await createDomain({
                name: formData.name,
                description: formData.description,
                icon: formData.icon,
                technologies: technologiesArray,
            });

            setSuccessMessage('Domain created successfully.');
            setFormData({
                name: '',
                description: '',
                icon: '',
                technologies: '',
            });
        } catch (err) {
            setError(err.message || 'Failed to create domain');
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = {
        maxWidth: '600px',
        margin: '2rem auto',
    };

    const formGroupStyle = {
        marginBottom: '1.25rem',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500',
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #d1d5db',
        fontSize: '1rem',
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '120px',
        resize: 'vertical',
    };

    const buttonStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        backgroundColor: 'var(--primary-blue)',
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer',
        width: '100%',
    };

    return (
        <Layout>
            <div className="container">
                <div className="card" style={containerStyle}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Create Learning Domain</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={formGroupStyle}>
                            <label htmlFor="name" style={labelStyle}>
                                Domain Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label htmlFor="description" style={labelStyle}>
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={textareaStyle}
                                required
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label htmlFor="icon" style={labelStyle}>
                                Icon (emoji or short text)
                            </label>
                            <input
                                id="icon"
                                name="icon"
                                type="text"
                                value={formData.icon}
                                onChange={handleChange}
                                style={inputStyle}
                                placeholder="e.g. 🚀"
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label htmlFor="technologies" style={labelStyle}>
                                Technologies (comma-separated)
                            </label>
                            <input
                                id="technologies"
                                name="technologies"
                                type="text"
                                value={formData.technologies}
                                onChange={handleChange}
                                style={inputStyle}
                                placeholder="React, Node.js, MongoDB"
                            />
                        </div>

                        {error && (
                            <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
                                {error}
                            </p>
                        )}
                        {successMessage && (
                            <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>
                                {successMessage}
                            </p>
                        )}

                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading ? 'Creating...' : 'Create Domain'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default AdminCreateDomain;

