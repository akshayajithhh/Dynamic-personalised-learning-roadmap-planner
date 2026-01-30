import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/ui/ProgressBar';
import Loader from '../components/ui/Loader';
import { getProgress } from '../services/api';

const Progress = () => {
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const data = await getProgress();
                setEntries(data || []);
            } catch (error) {
                console.error('Failed to fetch progress', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const totalModules = entries.length || 0;
    const completed = entries.filter(e => e.status === 'completed').length;
    const percentage = totalModules ? Math.round((completed / totalModules) * 100) : 0;
    // Simple derived metric: assume ~1.5h per module touched
    const hoursSpent = (completed || totalModules) * 1.5;

    return (
        <Layout>
            <div className="container">
                <h2 className="title">Your Progress</h2>

                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '3rem', color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>{completed} 🔥</h3>
                                <p>Modules Completed</p>
                            </div>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '0.5rem' }}>{percentage}%</h3>
                                <p>Course Completed</p>
                            </div>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '3rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>{hoursSpent.toFixed(1)}h</h3>
                                <p>Estimated Time Spent</p>
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Overall Status</h3>
                            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total Modules Tracked</span>
                                <span>{totalModules}</span>
                            </div>
                            <ProgressBar progress={percentage} />
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Progress;
