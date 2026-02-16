import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ResourceCard from '../components/cards/ResourceCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { getModuleResources, updateProgress } from '../services/api';

const ModuleDetail = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const techId = location.state?.techId; // Get domainId from navigation state
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markingComplete, setMarkingComplete] = useState(false);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const data = await getModuleResources(moduleId);
                setModule(data);
            } catch (error) {
                console.error('Failed to fetch module', error);
            } finally {
                setLoading(false);
            }
        };

        fetchModule();
    }, [moduleId]);

    const handleComplete = async () => {
        setMarkingComplete(true);
        try {
            // Pass domainId (techId) along with skillId so backend can find the correct roadmap
            await updateProgress({
                skillId: moduleId,
                status: 'completed',
                domain: techId
            });
            // Navigate back to roadmap with techId to refresh data
            navigate('/roadmap', { state: { techId } });
        } catch (error) {
            console.error('Failed to update progress', error);
            setMarkingComplete(false);
        }
    };

    if (loading) return <Layout><Loader /></Layout>;
    if (!module) return <Layout><div className="container">Module not found</div></Layout>;

    return (
        <Layout>
            <div className="container">
                <Button onClick={() => navigate(-1)} variant="ghost" style={{ marginBottom: '1rem', paddingLeft: 0 }}>
                    ← Back to Roadmap
                </Button>

                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h1 className="title" style={{ marginBottom: '1rem' }}>{module.title}</h1>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-dark)', marginBottom: '2rem' }}>
                        {module.content}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleComplete} variant="primary" disabled={markingComplete}>
                            {markingComplete ? 'Updating...' : 'Mark as Complete'}
                        </Button>
                    </div>
                </div>

                {module.studyTips && (
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Tips and Tricks for Your Level</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                            Level: <strong>{module.studyTips.level}</strong> | Style: <strong>{module.studyTips.learningStyle}</strong> | Cadence: <strong>{module.studyTips.recommendedCadence}</strong>
                        </p>
                        <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                            {(module.studyTips.tips || []).map((tip, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <h3 style={{ marginBottom: '1rem' }}>Learning Resources</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {module.resources && module.resources.map((resource, idx) => (
                        <ResourceCard key={idx} resource={resource} />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ModuleDetail;
