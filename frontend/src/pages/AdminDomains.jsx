import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { useUser } from '../context/useUser';
import { deleteDomain, getAdminOverview } from '../services/api';

const AdminDomains = () => {
    const { loading: userLoading, user, isAdmin } = useUser();
    const [overview, setOverview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deletingDomainId, setDeletingDomainId] = useState('');

    const loadOverview = async () => {
        setLoading(true);
        try {
            const data = await getAdminOverview();
            setOverview(data || []);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Unable to load current domains.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOverview();
    }, []);

    const handleDeleteDomain = async (domain) => {
        const confirmed = window.confirm(
            `Delete "${domain.name}" and all of its modules, skills, resources, and learner roadmaps?`
        );
        if (!confirmed) return;

        setDeletingDomainId(domain._id);
        setMessage({ type: '', text: '' });

        try {
            await deleteDomain(domain._id);
            setMessage({ type: 'success', text: `Domain "${domain.name}" deleted successfully.` });
            await loadOverview();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete domain.' });
        } finally {
            setDeletingDomainId('');
        }
    };

    if (userLoading) {
        return (
            <Layout>
                <div className="container">
                    <Loader />
                </div>
            </Layout>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <Layout>
            <div className="container">
                <header className="admin-panel-header">
                    <div>
                        <h1 className="page-title">Current Domains</h1>
                        <p>View all current domains here, including their modules, skills, and resources.</p>
                    </div>
                    <div className="admin-overview-head">
                        <Button to="/admin/create-domain" variant="outline">
                            Back to Admin Panel
                        </Button>
                        <Button onClick={loadOverview} variant="ghost">
                            Refresh
                        </Button>
                    </div>
                </header>

                {message.text && (
                    <div className={`admin-message ${message.type === 'error' ? 'error' : 'success'}`}>
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <Loader />
                ) : overview.length === 0 ? (
                    <div className="card">
                        <p className="admin-empty">No domains found yet.</p>
                    </div>
                ) : (
                    <section className="admin-tree">
                        {overview.map((domain) => (
                            <article key={domain._id} className="card admin-tree-item">
                                <div className="admin-domain-head">
                                    <h4>{domain.icon || '[]'} {domain.name}</h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteDomain(domain)}
                                        disabled={deletingDomainId === domain._id}
                                    >
                                        {deletingDomainId === domain._id ? 'Deleting...' : 'Delete Domain'}
                                    </Button>
                                </div>
                                <p>{domain.description}</p>
                                <div className="admin-tags">
                                    {(domain.technologies || []).map((item) => (
                                        <span key={`${domain._id}-${item}`} className="admin-tag">{item}</span>
                                    ))}
                                </div>
                                <p className="subtle-text" style={{ marginTop: '0.75rem' }}>
                                    {(domain.modules || []).length} module(s) in this domain
                                </p>
                                <div className="admin-subtree">
                                    {(domain.modules || []).map((module) => (
                                        <div key={module._id} className="admin-subtree-item">
                                            <strong>Module {module.order}: {module.name}</strong>
                                            <p>{module.description}</p>
                                            <div className="admin-mini-list">
                                                {(module.skills || []).map((skill) => (
                                                    <div key={skill._id} className="admin-mini-card">
                                                        <div className="admin-mini-head">
                                                            <span>{skill.name}</span>
                                                            <span className="status-chip">{skill.level}</span>
                                                        </div>
                                                        <p>{skill.description}</p>
                                                        <span className="subtle-text">
                                                            {(skill.resources || []).length} resource(s)
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </Layout>
    );
};

export default AdminDomains;
