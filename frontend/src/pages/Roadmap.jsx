import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ModuleCard from '../components/cards/ModuleCard';
import Loader from '../components/ui/Loader';
import { getRoadmap } from '../services/api';

const Roadmap = () => {
    const location = useLocation();
    const techId = location.state?.techId;
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!techId) {
            setLoading(false);
            return;
        }

        const fetchRoadmap = async () => {
            setLoading(true);
            try {
                const data = await getRoadmap(techId);
                setModules(data);
            } catch (error) {
                console.error('Failed to fetch roadmap', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [techId]);

    // Refresh roadmap when returning from module detail (location.key changes)
    useEffect(() => {
        if (techId && location.key) {
            const fetchRoadmap = async () => {
                try {
                    const data = await getRoadmap(techId);
                    setModules(data);
                } catch (error) {
                    console.error('Failed to refresh roadmap', error);
                }
            };
            fetchRoadmap();
        }
    }, [location.key, techId]);

    return (
        <Layout>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 className="title" style={{ marginBottom: '0.5rem' }}>Your Roadmap</h2>
                        {techId && (
                            <p style={{ color: 'var(--text-light)' }}>Track: {techId.toUpperCase()}</p>
                        )}
                    </div>
                    <Link to="/dashboard" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>Change Track</Link>
                </div>

                {loading ? (
                    <Loader />
                ) : !techId ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <h3>No track selected</h3>
                        <p>Please choose a technology from the dashboard to generate a roadmap.</p>
                    </div>
                ) : (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {modules.length > 0 ? (
                            modules.map((module, index) => (
                                <div key={module.id} style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{
                                            width: '2rem',
                                            height: '2rem',
                                            borderRadius: '50%',
                                            backgroundColor: module.status === 'locked' ? '#e5e7eb' : 'var(--primary-blue)',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            zIndex: 1
                                        }}>
                                            {index + 1}
                                        </div>
                                        {index < modules.length - 1 && (
                                            <div style={{ width: '2px', flex: 1, backgroundColor: '#e5e7eb', margin: '0.5rem 0' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, paddingBottom: '2rem' }}>
                                        <ModuleCard module={module} techId={techId} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                <h3>No modules found</h3>
                                <p>It seems this track is empty or under construction.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Roadmap;
