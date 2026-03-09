import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import Loader from '../components/ui/Loader';
import ProgressBar from '../components/ui/ProgressBar';
import { getProgress } from '../services/api';

const Progress = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalSkills: 0,
        completedSkills: 0,
        completionPercentage: 0,
    });

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const data = await getProgress();
                setSummary(data?.summary || {});
            } catch (error) {
                console.error('Failed to fetch progress', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const remaining = useMemo(() => {
        const total = Number(summary.totalSkills || 0);
        const done = Number(summary.completedSkills || 0);
        return Math.max(0, total - done);
    }, [summary.completedSkills, summary.totalSkills]);

    return (
        <Layout>
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Progress Tracking</h1>
                    <p className="page-subtitle">
                        Review your learning status across completed and pending modules.
                    </p>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <section className="progress-grid">
                            <article className="card">
                                <h3 className="progress-number">{summary.completionPercentage || 0}%</h3>
                                <p>Total roadmap progress</p>
                            </article>
                            <article className="card">
                                <h3 className="progress-number">{summary.completedSkills || 0}</h3>
                                <p>Completed modules</p>
                            </article>
                            <article className="card">
                                <h3 className="progress-number">{remaining}</h3>
                                <p>Remaining modules</p>
                            </article>
                        </section>

                        <section className="card">
                            <h3 style={{ marginBottom: '0.75rem' }}>Overall completion</h3>
                            <ProgressBar progress={summary.completionPercentage || 0} />
                        </section>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Progress;
