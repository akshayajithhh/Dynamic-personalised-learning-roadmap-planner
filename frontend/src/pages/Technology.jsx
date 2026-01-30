import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { getTechnology } from '../services/api';

const Technology = () => {
    const { techId } = useParams();
    const [tech, setTech] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTech = async () => {
            try {
                const data = await getTechnology(techId);
                setTech(data);
            } catch (error) {
                console.error('Failed to fetch technology', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTech();
    }, [techId]);

    if (loading) return <Layout><Loader /></Layout>;
    if (!tech) return <Layout><div className="container">Technology not found</div></Layout>;

    return (
        <Layout>
            <div className="container">
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{tech.icon}</div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Master {tech.name}</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
                        {tech.description}
                    </p>

                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>What you'll learn</h3>
                        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                            <li style={{ marginBottom: '0.5rem' }}>✅ Core Concepts & Syntax</li>
                            <li style={{ marginBottom: '0.5rem' }}>✅ Best Practices</li>
                            <li style={{ marginBottom: '0.5rem' }}>✅ Real-world Projects</li>
                        </ul>
                    </div>

                    <Button to={`/learning-form/${techId}`} variant="primary" size="lg">
                        Create My Roadmap
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default Technology;
