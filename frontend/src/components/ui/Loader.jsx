import React from 'react';

const Loader = ({ size = 'md' }) => {
    const sizes = {
        sm: '1.5rem',
        md: '2.5rem',
        lg: '4rem',
    };

    return (
        <div className="loader-wrap">
            <div className="spinner" style={{ width: sizes[size], height: sizes[size] }} />
        </div>
    );
};

export default Loader;
