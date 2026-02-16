import React from 'react';
import Button from '../ui/Button';

const ResourceCard = ({ resource }) => {
    const cardStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
    };

    return (
        <div className="card" style={cardStyle}>
            <div>
                <h4 style={{ marginBottom: '0.25rem' }}>{resource.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                    {(resource.type || 'Link').toUpperCase()} {resource.difficulty ? `| ${resource.difficulty}` : ''}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    Rating: {resource.rating || 'N/A'} {resource.isSuggested ? '| Suggested backup resource' : ''}
                </p>
            </div>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">Open</Button>
            </a>
        </div>
    );
};

export default ResourceCard;
