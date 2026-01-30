import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LearningForm from '../components/forms/LearningForm';
import { submitLearningPreferences } from '../services/api';

const LearningFormPage = () => {
    const { techId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (preferences) => {
        setLoading(true);
        try {
            await submitLearningPreferences({ ...preferences, techId });
            navigate('/roadmap', { state: { techId } });
        } catch (error) {
            console.error('Failed to generate roadmap', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 className="title" style={{ textAlign: 'center' }}>Customize Your Path</h2>
                    <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-light)' }}>
                        Tell us about your preferences so we can build the perfect schedule for you.
                    </p>
                    <div className="card">
                        <LearningForm onSubmit={handleSubmit} loading={loading} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LearningFormPage;
