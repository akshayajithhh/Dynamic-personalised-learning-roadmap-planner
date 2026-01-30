import React from 'react';
import Button from '../ui/Button';

const ResourceCard = ({ resource }) => {
    const cardStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    return (
        <div className="card" style={cardStyle}>
            <div>
                <h4 style={{ marginBottom: '0.25rem' }}>{resource.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{resource.type || 'Link'}</p>
            </div>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">Open</Button>
            </a>
        </div>
    );
};

export default ResourceCard;
