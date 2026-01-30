import React from 'react';

const ProgressBar = ({ progress }) => {
    const containerStyle = {
        width: '100%',
        height: '0.75rem',
        backgroundColor: '#e5e7eb',
        borderRadius: '9999px',
        overflow: 'hidden',
    };

    const fillStyle = {
        height: '100%',
        width: `${Math.min(100, Math.max(0, progress))}%`,
        backgroundColor: 'var(--primary-blue)',
        transition: 'width 0.5s ease-out',
        borderRadius: '9999px',
    };

    return (
        <div style={containerStyle}>
            <div style={fillStyle} />
        </div>
    );
};

export default ProgressBar;
