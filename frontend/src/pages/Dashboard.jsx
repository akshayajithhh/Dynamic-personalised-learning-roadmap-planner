import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import TechCard from '../components/cards/TechCard';
import Loader from '../components/ui/Loader';
import { getTechnologies } from '../services/api';
import { useUser } from '../context/useUser';
import Button from '../components/ui/Button';

const Dashboard = () => {
    const { isAdmin, user } = useUser();
    const [techs, setTechs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTechs = async () => {
            try {
                const data = await getTechnologies();
                setTechs(data);
                setError('');
            } catch (error) {
                console.error('Failed to fetch technologies', error);
                setError(error.message || 'Unable to load domains right now.');
            } finally {
                setLoading(false);
            }
        };

        fetchTechs();
    }, []);

    if (isAdmin) {
        return (
            <Layout>
                <div className="container">
                    <div className="page-header">
                        <h1 className="page-title">Admin Overview</h1>
                        <p className="page-subtitle">
                            Manage domains, modules, skills, and resources from one place. Admin accounts do not need
                            learner roadmaps.
                        </p>
                    </div>

                    <section className="info-grid">
                        <article className="card">
                            <h3>Domain Management</h3>
                            <p>Create new domains and expand the catalog visible to learners.</p>
                        </article>
                        <article className="card">
                            <h3>Curriculum Setup</h3>
                            <p>Add modules and skills that define the structure of each domain roadmap.</p>
                        </article>
                        <article className="card">
                            <h3>Resource Curation</h3>
                            <p>Attach learning resources so every skill has useful study material.</p>
                        </article>
                    </section>

                    <div className="card" style={{ marginTop: '1.5rem' }}>
                        <h3 style={{ marginBottom: '0.6rem' }}>Admin actions</h3>
                        <p style={{ margin: 0, color: 'var(--text-light)' }}>
                            Signed in as {user?.name}. Open the admin panel to add domains, modules, skills, and
                            resources.
                        </p>
                        <div style={{ marginTop: '1rem' }}>
                            <Button to="/admin/create-domain" variant="primary">
                                Open Admin Panel
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container">
                <h2 className="title">Explore Technologies</h2>
                <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-light)' }}>
                    Select a path to begin your personalized learning journey.
                </p>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="card" style={{ maxWidth: '720px' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Unable to load data</h3>
                        <p style={{ margin: 0 }}>
                            {error}. Make sure backend and MongoDB are running, then seed data with `npm run seed` in
                            `backend`.
                        </p>
                    </div>
                ) : techs.length === 0 ? (
                    <div className="card" style={{ maxWidth: '720px' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>No domains found</h3>
                        <p style={{ margin: 0 }}>
                            Data is empty in the database. Run `npm run seed` inside `backend` to load domains,
                            modules, and skills.
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        {techs.map(tech => (
                            <TechCard key={tech._id} tech={tech} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
