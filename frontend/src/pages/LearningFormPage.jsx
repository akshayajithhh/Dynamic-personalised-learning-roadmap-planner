import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LearningForm from '../components/forms/LearningForm';
import Loader from '../components/ui/Loader';
import { getTechnologies, submitLearningPreferences } from '../services/api';

const LearningFormPage = () => {
    const { techId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [techOptions, setTechOptions] = useState([]);
    const [initializing, setInitializing] = useState(true);

    React.useEffect(() => {
        const loadOptions = async () => {
            try {
                const data = await getTechnologies();
                setTechOptions(data || []);
            } catch (error) {
                console.error('Failed to fetch domains', error);
                setFormError('Unable to load domains. Please try again.');
            } finally {
                setInitializing(false);
            }
        };
        loadOptions();
    }, []);

    const handleSubmit = async (preferences) => {
        setLoading(true);
        setFormError('');
        try {
            await submitLearningPreferences({ ...preferences, techId: preferences.techId || techId });
            navigate('/my-roadmaps', { state: { techId: preferences.techId || techId } });
        } catch (error) {
            console.error('Failed to generate roadmap', error);
            setFormError('Roadmap generation failed. Please verify your selection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="form-shell">
                    <div className="page-header" style={{ textAlign: 'center' }}>
                        <h1 className="page-title">Generate Roadmap</h1>
                        <p className="page-subtitle" style={{ margin: '0.75rem auto 0' }}>
                            Configure your domain, level, available time, and learning style to build a focused roadmap.
                        </p>
                    </div>

                    {initializing ? (
                        <Loader />
                    ) : (
                        <div className="card">
                            <LearningForm onSubmit={handleSubmit} loading={loading} techOptions={techOptions} initialTechId={techId} />
                            {formError && (
                                <p style={{ marginTop: '0.9rem', color: '#111111', fontSize: '0.92rem' }}>{formError}</p>
                            )}
                        </div>
                    )}

                    {!initializing && techOptions.length === 0 && !formError && (
                        <p className="subtle-text" style={{ marginTop: '0.75rem' }}>
                            No domains are available right now. Add a domain from the admin panel first.
                        </p>
                    )}

                    <p className="subtle-text" style={{ marginTop: '0.9rem', textAlign: 'center' }}>
                        Your roadmap is generated based on the latest saved preferences.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default LearningFormPage;
