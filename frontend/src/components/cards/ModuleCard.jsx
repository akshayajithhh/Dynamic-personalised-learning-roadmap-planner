import React from 'react';
import { Link } from 'react-router-dom';

const ModuleCard = ({ module, techId }) => {
    const isLocked = module.status === 'locked';

    const cardStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        backgroundColor: isLocked ? '#f3f4f6' : 'var(--surface-color)',
        borderLeft: isLocked ? '4px solid #d1d5db' : '4px solid var(--primary-blue)',
        opacity: isLocked ? 0.8 : 1,
        cursor: isLocked ? 'not-allowed' : 'pointer',
        marginBottom: '1rem',
        position: 'relative',
    };

    const contentStyle = {
        flex: 1,
    };

    const titleStyle = {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: isLocked ? '#6b7280' : 'var(--secondary-black)',
        marginBottom: '0.25rem',
    };

    const statusStyle = {
        fontSize: '0.875rem',
        color: isLocked ? '#9ca3af' : 'var(--success)',
        fontWeight: '500',
        textTransform: 'uppercase',
    };

    const iconStyle = {
        fontSize: '1.5rem',
        marginLeft: '1rem',
    };

    const CardContent = (
        <div className={!isLocked ? "card" : ""} style={cardStyle}>
            <div style={contentStyle}>
                <h4 style={titleStyle}>{module.title}</h4>
                <span style={statusStyle}>{isLocked ? 'Locked' : 'Unlocked'}</span>
            </div>
            <div style={iconStyle}>
                {isLocked ? '🔒' : '👉'}
            </div>
        </div>
    );

    if (isLocked) {
        return <div>{CardContent}</div>;
    }

    return (
        <Link to={`/roadmap/module/${module.id}`} state={{ techId }}>
            {CardContent}
        </Link>
    );
};

export default ModuleCard;
