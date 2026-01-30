import React from 'react';

const Footer = () => {
    const footerStyles = {
        backgroundColor: 'var(--secondary-black)',
        color: 'var(--text-white)',
        padding: '2rem 1rem',
        marginTop: 'auto',
    };

    const containerStyles = {
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
    };

    return (
        <footer style={footerStyles}>
            <div style={containerStyles}>
                <p>&copy; {new Date().getFullYear()} Dynamic Personalized Roadmap Planner. All rights reserved.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                    Built for learning tracking tracking.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
