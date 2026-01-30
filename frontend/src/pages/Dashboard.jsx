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

    useEffect(() => {
        const fetchTechs = async () => {
            try {
                const data = await getTechnologies();
                setTechs(data);
            } catch (error) {
                console.error('Failed to fetch technologies', error);
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
