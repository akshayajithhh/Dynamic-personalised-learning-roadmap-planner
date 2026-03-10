import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { useUser } from '../context/useUser';
import { getProgress, getRoadmap, getUserRoadmaps } from '../services/api';

const Settings = () => {
    const { user, isAdmin } = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [roadmaps, setRoadmaps] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('');
    const [selectedRoadmap, setSelectedRoadmap] = useState([]);
    const [summary, setSummary] = useState({
        completionPercentage: 0,
        completedSkills: 0,
        totalSkills: 0,
    });

    useEffect(() => {
        const loadProfileData = async () => {
            setLoading(true);
            setError('');

            try {
                if (isAdmin) {
                    setLoading(false);
                    return;
                }

                const [progressData, roadmapData] = await Promise.all([
                    getProgress(),
                    getUserRoadmaps(),
                ]);

                setSummary(progressData?.summary || {});
                setRoadmaps(roadmapData || []);

                const firstDomain = roadmapData?.[0]?.domain || '';
                setSelectedDomain(firstDomain);
            } catch (err) {
                setError(err.message || 'Unable to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, [isAdmin]);

    useEffect(() => {
        const loadSelectedRoadmap = async () => {
            if (!selectedDomain || isAdmin) {
                setSelectedRoadmap([]);
                return;
            }

            try {
                const data = await getRoadmap(selectedDomain);
                setSelectedRoadmap(data || []);
            } catch {
                setSelectedRoadmap([]);
            }
        };

        loadSelectedRoadmap();
    }, [selectedDomain, isAdmin]);

    const selectedRoadmapSummary = useMemo(
        () => roadmaps.find((item) => item.domain === selectedDomain),
        [roadmaps, selectedDomain]
    );

    return (
        <Layout>
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Profile</h1>
                    <p className="page-subtitle">
                        {isAdmin
                            ? 'Your account is configured for administration. Use the admin panel to manage learning content.'
                            : 'Review your account, select a roadmap, and inspect each step of your current learning path.'}
                    </p>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <div className="profile-grid">
                        <section className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Account Details</h3>
                            <div className="profile-list">
                                <div>
                                    <span className="subtle-text">Name</span>
                                    <p>{user?.name || '-'}</p>
                                </div>
                                <div>
                                    <span className="subtle-text">Email</span>
                                    <p>{user?.email || '-'}</p>
                                </div>
                                <div>
                                    <span className="subtle-text">Role</span>
                                    <p style={{ textTransform: 'capitalize' }}>{user?.role || 'user'}</p>
                                </div>
                            </div>

                            {isAdmin && (
                                <div style={{ marginTop: '1rem' }}>
                                    <Button to="/admin/create-domain" variant="primary">
                                        Open Admin Panel
                                    </Button>
                                </div>
                            )}
                        </section>

                        {!isAdmin && (
                            <>
                                <section className="card">
                                    <h3 style={{ marginBottom: '1rem' }}>Roadmap Summary</h3>
                                    {error && <div className="admin-message error">{error}</div>}
                                    <section className="progress-grid" style={{ marginBottom: 0 }}>
                                        <article>
                                            <h3 className="progress-number">{summary.completionPercentage || 0}%</h3>
                                            <p>Total progress</p>
                                        </article>
                                        <article>
                                            <h3 className="progress-number">{summary.completedSkills || 0}</h3>
                                            <p>Completed skills</p>
                                        </article>
                                        <article>
                                            <h3 className="progress-number">{summary.totalSkills || 0}</h3>
                                            <p>Total skills</p>
                                        </article>
                                    </section>
                                </section>

                                <section className="card profile-roadmap-panel">
                                    <div className="profile-roadmap-head">
                                        <div>
                                            <h3 style={{ marginBottom: '0.5rem' }}>Selected Roadmap</h3>
                                            <p className="admin-subtitle">
                                                Choose one of your generated roadmaps to inspect the full sequence.
                                            </p>
                                        </div>
                                        <Button to="/dashboard" variant="outline">
                                            Generate Another
                                        </Button>
                                    </div>

                                    {roadmaps.length > 0 ? (
                                        <>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="profile-roadmap-domain">
                                                    Roadmap Domain
                                                </label>
                                                <select
                                                    id="profile-roadmap-domain"
                                                    className="form-control"
                                                    value={selectedDomain}
                                                    onChange={(event) => setSelectedDomain(event.target.value)}
                                                >
                                                    {roadmaps.map((item) => (
                                                        <option key={item._id} value={item.domain}>
                                                            {item.domain}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {selectedRoadmapSummary && (
                                                <div className="profile-roadmap-meta">
                                                    <span>{selectedRoadmapSummary.completedSkills} completed</span>
                                                    <span>{selectedRoadmapSummary.totalSkills} total steps</span>
                                                </div>
                                            )}

                                            <div className="admin-list" style={{ marginTop: '1rem' }}>
                                                {selectedRoadmap.map((item) => (
                                                    <article key={item.id} className="admin-domain-item">
                                                        <h4>{item.title}</h4>
                                                        <p>{item.description || 'No description provided for this skill yet.'}</p>
                                                        <div className="roadmap-meta">
                                                            <span className="status-chip">{item.status}</span>
                                                            <span>{item.estimatedHours || 0} hours</span>
                                                            <span>{item.resourceTitle || item.type || 'No resource assigned'}</span>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="admin-empty">
                                            No roadmap found yet. Generate one from the dashboard to see it here.
                                        </p>
                                    )}
                                </section>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Settings;
