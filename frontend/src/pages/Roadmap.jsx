import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { getRoadmap, getTechnologies, updateProgress } from '../services/api';
import { useUser } from '../context/useUser';

const Roadmap = () => {
    const location = useLocation();
    const { isAdmin } = useUser();
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(location.state?.techId || '');
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingSkillId, setUpdatingSkillId] = useState('');
    const [actionError, setActionError] = useState('');

    useEffect(() => {
        const loadDomains = async () => {
            try {
                const data = await getTechnologies();
                setDomains(data || []);
                if (!selectedDomain && data?.length) {
                    setSelectedDomain(data[0]._id || data[0].name);
                }
            } catch (error) {
                console.error('Failed to load domains', error);
            }
        };

        loadDomains();
    }, [selectedDomain]);

    useEffect(() => {
        const fetchRoadmap = async () => {
            if (!selectedDomain) {
                setModules([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const data = await getRoadmap(selectedDomain);
                setModules(data || []);
            } catch (error) {
                console.error('Failed to fetch roadmap', error);
                setModules([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [selectedDomain, location.key]);

    const completedCount = useMemo(
        () => modules.filter((module) => module.status === 'completed').length,
        [modules]
    );

    const handleMarkComplete = async (moduleId) => {
        if (!selectedDomain) return;
        setUpdatingSkillId(moduleId);
        setActionError('');
        try {
            await updateProgress({
                skillId: moduleId,
                status: 'completed',
                domain: selectedDomain,
            });

            setModules((prev) =>
                prev.map((module) => {
                    if (module.id === moduleId) return { ...module, status: 'completed' };
                    return module;
                })
            );
        } catch (error) {
            console.error('Failed to mark module complete', error);
            setActionError(error.message || 'Unable to update roadmap progress.');
        } finally {
            setUpdatingSkillId('');
        }
    };

    if (isAdmin) {
        return <Navigate to="/admin/create-domain" replace />;
    }

    return (
        <Layout>
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Generated Roadmap</h1>
                    <p className="page-subtitle">
                        Follow your module sequence, review suggested resources, and mark completed steps as you
                        progress.
                    </p>
                </div>

                <div className="card" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                        <div>
                            <label className="form-label" htmlFor="domain-select">Domain / Career Goal</label>
                            <select
                                id="domain-select"
                                className="form-control"
                                value={selectedDomain}
                                onChange={(event) => setSelectedDomain(event.target.value)}
                            >
                                {domains.map((domain) => (
                                    <option key={domain._id || domain.name} value={domain._id || domain.name}>
                                        {domain.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="subtle-text" style={{ margin: 0 }}>
                            Completed modules: {completedCount} / {modules.length}
                        </p>
                        {actionError && <p className="admin-message error" style={{ margin: 0 }}>{actionError}</p>}
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : modules.length === 0 ? (
                    <div className="card">
                        <h3>No roadmap found</h3>
                        <p>Generate a roadmap first to view your structured learning stages.</p>
                        <div style={{ marginTop: '0.9rem' }}>
                            <Button to="/generate-roadmap" variant="primary">Generate Roadmap</Button>
                        </div>
                    </div>
                ) : (
                    <section className="roadmap-shell">
                        {modules.map((module) => {
                            const isLocked = module.status === 'locked';
                            const isCompleted = module.status === 'completed';
                            const buttonLabel = isCompleted ? 'Completed' : 'Mark as Completed';

                            return (
                                <article className="roadmap-item" key={module.id}>
                                    <div className="card">
                                        <h3>{module.title}</h3>
                                        <p>{module.description || 'Core concepts and guided practice for this module.'}</p>
                                        <div className="roadmap-meta">
                                            <span>
                                                Suggested resource: {module.resourceTitle || module.type || 'Structured learning material'}
                                            </span>
                                            <span>
                                                Estimated completion time: {module.estimatedHours ? `${module.estimatedHours} hours` : '4 hours'}
                                            </span>
                                            <span className="status-chip">{module.status}</span>
                                        </div>
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                            <Button
                                                variant={isCompleted ? 'outline' : 'primary'}
                                                disabled={isLocked || isCompleted || updatingSkillId === module.id}
                                                onClick={() => handleMarkComplete(module.id)}
                                            >
                                                {updatingSkillId === module.id ? 'Updating...' : buttonLabel}
                                            </Button>
                                            {module.resourceUrl && (
                                                <Button to={module.resourceUrl} variant="outline" target="_blank" rel="noreferrer">
                                                    Open Resource
                                                </Button>
                                            )}
                                            <Link
                                                to={`/roadmap/module/${module.id}`}
                                                state={{ techId: selectedDomain }}
                                                className="btn btn-ghost btn-md"
                                            >
                                                View Module Details
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </div>
        </Layout>
    );
};

export default Roadmap;
