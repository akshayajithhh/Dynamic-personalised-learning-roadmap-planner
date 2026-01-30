import React from 'react';
import Layout from '../components/layout/Layout';

const About = () => {
    return (
        <Layout>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 className="title">About DPR Planner</h1>
                <div className="card">
                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                        The Dynamic Personalized Roadmap Planner (DPR) is an advanced tool designed to help developers navigate the complex landscape of technology learning.
                    </p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                        Our mission is to replace generic "one-size-fits-all" tutorials with custom-tailored learning paths that respect your:
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Current Skill Level</li>
                        <li style={{ marginBottom: '0.5rem' }}>Available Time</li>
                        <li style={{ marginBottom: '0.5rem' }}>Preferred Learning Style</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default About;
