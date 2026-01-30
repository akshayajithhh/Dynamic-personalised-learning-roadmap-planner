import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const Home = () => {
    return (
        <Layout>
            <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                    Your <span style={{ color: 'var(--primary-blue)' }}>Personalized</span><br />
                    Path to Mastery
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                    Stop guessing what to learn next. Get a custom roadmap tailored to your goals, time, and learning style.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Button to="/register" variant="primary" size="lg">Start Learning Now</Button>
                    <Button to="/login" variant="outline" size="lg">I already have an account</Button>
                </div>

                <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="card">
                        <h3>🎯 Custom Roadmaps</h3>
                        <p>Generated based on your actual skill level and available time.</p>
                    </div>
                    <div className="card">
                        <h3>📈 Track Progress</h3>
                        <p>Visualize your journey and stay motivated with daily streaks.</p>
                    </div>
                    <div className="card">
                        <h3>🧠 Adaptive Learning</h3>
                        <p>Choose between videos, docs, or projects to suit your style.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
