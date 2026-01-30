import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const TechCard = ({ tech }) => {
    const cardStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
    };

    const iconStyle = {
        fontSize: '3rem',
        marginBottom: '1rem',
    };

    const titleStyle = {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        color: 'var(--secondary-black)',
    };

    const descStyle = {
        color: 'var(--text-light)',
        marginBottom: '1.5rem',
        flex: 1,
    };

    return (
        <div className="card" style={cardStyle}>
            <div style={iconStyle}>{tech.icon}</div>
            <h3 style={titleStyle}>{tech.name}</h3>
            <p style={descStyle}>{tech.description}</p>
            <Button to={`/technology/${tech._id}`} variant="primary">
                Start Learning
            </Button>
        </div>
    );
};

export default TechCard;
