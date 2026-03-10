import React from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const Home = () => {
    return (
        <Layout>
            <div className="container">
                <section className="landing-hero">
                    <div className="landing-copy">
                        <span className="landing-kicker">Adaptive learning system</span>
                        <h1 className="landing-title">Build a roadmap that moves like you do.</h1>
                        <p className="landing-lead">
                            Turn one goal into a living path with domain-aware modules, curated resources, and progress
                            that updates as you finish real work.
                        </p>
                        <div className="landing-actions">
                            <Button to="/generate-roadmap" variant="primary" size="lg">
                                Generate Your Roadmap
                            </Button>
                            <Button to="/dashboard" variant="outline" size="lg">
                                Explore Domains
                            </Button>
                        </div>

                        <div className="landing-stats">
                            <article className="landing-stat">
                                <strong>15+</strong>
                                <span>domain tracks</span>
                            </article>
                            <article className="landing-stat">
                                <strong>4 layers</strong>
                                <span>domain to resource</span>
                            </article>
                            <article className="landing-stat">
                                <strong>1 profile</strong>
                                <span>all roadmap details</span>
                            </article>
                        </div>
                    </div>

                    <div className="landing-visual" aria-hidden="true">
                        <div className="landing-orbit orbit-one" />
                        <div className="landing-orbit orbit-two" />
                        <div className="landing-core">
                            <div className="landing-core-ring" />
                            <div className="landing-core-content">
                                <span>Roadmap Engine</span>
                                <strong>Domain + Module + Skill + Resource</strong>
                            </div>
                        </div>

                        <article className="landing-float-card card-domain">
                            <span className="landing-float-label">Domain</span>
                            <strong>AI & ML Engineering</strong>
                            <p>Adaptive track selected</p>
                        </article>

                        <article className="landing-float-card card-module">
                            <span className="landing-float-label">Module</span>
                            <strong>LLM Application Development</strong>
                            <p>Unlocked next sequence</p>
                        </article>

                        <article className="landing-float-card card-resource">
                            <span className="landing-float-label">Resource</span>
                            <strong>Hands-on tutorial stack</strong>
                            <p>Matched to learning style</p>
                        </article>

                        <article className="landing-float-card card-progress">
                            <span className="landing-float-label">Progress</span>
                            <strong>68% complete</strong>
                            <p>3 milestones cleared</p>
                        </article>
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
