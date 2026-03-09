import React from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const Home = () => {
    return (
        <Layout>
            <div className="container">
                <section className="hero">
                    <h1 className="page-title">Dynamic Personalized Roadmap Planner</h1>
                    <p>
                        Create focused learning roadmaps using your domain goals, current skill level, available time,
                        and preferred learning style.
                    </p>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Button to="/generate-roadmap" variant="primary" size="lg">
                            Generate Your Roadmap
                        </Button>
                    </div>
                </section>

                <section className="section-space">
                    <div className="info-grid">
                        <article className="card">
                            <h3>Personalized learning paths</h3>
                            <p>Plans adapt to your current stage so each next module is relevant and manageable.</p>
                        </article>
                        <article className="card">
                            <h3>Skill-based roadmap generation</h3>
                            <p>Roadmaps are structured from foundational topics to advanced outcomes.</p>
                        </article>
                        <article className="card">
                            <h3>Progress tracking</h3>
                            <p>Monitor completion status, module counts, and remaining work in one place.</p>
                        </article>
                    </div>
                </section>

                <section className="section-space">
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>Start building your learning roadmap</h3>
                        <p>Sign in to save your plan and track progress across modules.</p>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <Button to="/login" variant="outline">Login</Button>
                            <Button to="/register" variant="primary">Create Account</Button>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Home;
