import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/ui/ProgressBar';
import Loader from '../components/ui/Loader';
import { getProgress } from '../services/api';

const Progress = () => {
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState({
        summary: {
            totalSkills: 0,
            completedSkills: 0,
            inProgressSkills: 0,
            unlockedSkills: 0,
            lockedSkills: 0,
            notStartedSkills: 0,
            completionPercentage: 0,
            estimatedHoursSpent: 0,
        },
        domains: [],
        skills: [],
        recentActivity: [],
    });

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const data = await getProgress();

                // Backward compatibility if backend returns the legacy array format.
                if (Array.isArray(data)) {
                    const totalSkills = data.length || 0;
                    const completedSkills = data.filter((e) => e.status === 'completed').length;
                    const inProgressSkills = data.filter((e) => e.status === 'in_progress').length;
                    const completionPercentage = totalSkills ? Math.round((completedSkills / totalSkills) * 100) : 0;

                    setProgressData({
                        summary: {
                            totalSkills,
                            completedSkills,
                            inProgressSkills,
                            unlockedSkills: totalSkills,
                            lockedSkills: 0,
                            notStartedSkills: Math.max(0, totalSkills - completedSkills - inProgressSkills),
                            completionPercentage,
                            estimatedHoursSpent: completedSkills * 1.5,
                        },
                        domains: [],
                        skills: [],
                        recentActivity: data.slice(0, 10),
                    });
                } else {
                    setProgressData(data || {});
                }
            } catch (error) {
                console.error('Failed to fetch progress', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const summary = progressData.summary || {};
    const domains = progressData.domains || [];
    const skills = progressData.skills || [];
    const recentActivity = progressData.recentActivity || [];

    const badgeStyle = (status) => {
        if (status === 'completed') return { background: '#dcfce7', color: '#166534' };
        if (status === 'in_progress') return { background: '#fef3c7', color: '#92400e' };
        if (status === 'locked') return { background: '#f3f4f6', color: '#4b5563' };
        return { background: '#dbeafe', color: '#1d4ed8' };
    };

    return (
        <Layout>
            <div className="container">
                <h2 className="title">Your Progress</h2>

                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '2.2rem', color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>{summary.completedSkills || 0}</h3>
                                <p>Skills Completed</p>
                            </div>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '2.2rem', color: 'var(--warning)', marginBottom: '0.25rem' }}>{summary.inProgressSkills || 0}</h3>
                                <p>In Progress</p>
                            </div>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '2.2rem', color: '#6b7280', marginBottom: '0.25rem' }}>{summary.lockedSkills || 0}</h3>
                                <p>Locked</p>
                            </div>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '2.2rem', color: 'var(--success)', marginBottom: '0.25rem' }}>{summary.completionPercentage || 0}%</h3>
                                <p>Overall Completion</p>
                            </div>
                        </div>

                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Overall Status</h3>
                            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total Skills Tracked</span>
                                <span>{summary.totalSkills || 0}</span>
                            </div>
                            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Not Started</span>
                                <span>{summary.notStartedSkills || 0}</span>
                            </div>
                            <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Estimated Hours Completed</span>
                                <span>{Number(summary.estimatedHoursSpent || 0).toFixed(1)}h</span>
                            </div>
                            <ProgressBar progress={summary.completionPercentage || 0} />
                        </div>

                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Domain Breakdown</h3>
                            {domains.length === 0 ? (
                                <p style={{ color: 'var(--text-light)' }}>No domain-level details yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    {domains.map((domain) => (
                                        <div key={domain.domain} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.9rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <strong>{domain.domain}</strong>
                                                <span>{domain.completionPercentage}%</span>
                                            </div>
                                            <ProgressBar progress={domain.completionPercentage} />
                                            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.6rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                                <span>Total: {domain.totalSkills}</span>
                                                <span>Completed: {domain.completedSkills}</span>
                                                <span>In Progress: {domain.inProgressSkills}</span>
                                                <span>Locked: {domain.lockedSkills}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
                            {recentActivity.length === 0 ? (
                                <p style={{ color: 'var(--text-light)' }}>No recent activity yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gap: '0.7rem' }}>
                                    {recentActivity.map((item, idx) => (
                                        <div key={`${item.skillId || item.skillName}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                                            <div>
                                                <strong>{item.skillName || 'Skill'}</strong>
                                                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                                    {item.domain || 'Domain'} | {item.module || 'Module'}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ ...badgeStyle(item.status), fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700', borderRadius: '999px', padding: '0.22rem 0.55rem' }}>
                                                    {String(item.status || 'not_started').replace('_', ' ')}
                                                </span>
                                                <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>
                                                    {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Skill Details</h3>
                            {skills.length === 0 ? (
                                <p style={{ color: 'var(--text-light)' }}>No skill-level detail available yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gap: '0.7rem' }}>
                                    {skills.map((skill) => (
                                        <div key={String(skill.skillId)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                                            <div>
                                                <strong>{skill.skillName}</strong>
                                                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                                    {skill.domain} | {skill.module} | {skill.level}
                                                </div>
                                            </div>
                                            <span style={{ ...badgeStyle(skill.status), fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700', borderRadius: '999px', padding: '0.22rem 0.55rem' }}>
                                                {String(skill.status).replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Progress;
