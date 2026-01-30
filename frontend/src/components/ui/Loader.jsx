import React from 'react';

const Loader = ({ size = 'md' }) => {
    const sizes = {
        sm: '1.5rem',
        md: '2.5rem',
        lg: '4rem',
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '2rem',
    };

    const spinnerStyle = {
        width: sizes[size],
        height: sizes[size],
        border: '4px solid #e5e7eb',
        borderTopColor: 'var(--primary-blue)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    };

    return (
        <div style={containerStyle}>
            <style>
                {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
            </style>
            <div style={spinnerStyle} />
        </div>
    );
};

export default Loader;
