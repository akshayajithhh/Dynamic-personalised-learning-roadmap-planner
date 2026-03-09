import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import TechCard from '../components/cards/TechCard';
import Loader from '../components/ui/Loader';
import { getTechnologies } from '../services/api';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
    const { user } = useUser();
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
