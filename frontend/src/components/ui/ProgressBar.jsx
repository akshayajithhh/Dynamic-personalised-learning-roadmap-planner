import React from 'react';

const ProgressBar = ({ progress }) => {
    const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0));

    return (
        <div style={{ width: '100%', height: '0.55rem', background: '#ededed', borderRadius: '999px', overflow: 'hidden' }}>
            <div
                style={{
                    height: '100%',
                    width: `${safeProgress}%`,
                    background: '#000000',
                    transition: 'width 0.25s ease',
                }}
            />
        </div>
    );
};

export default ProgressBar;
