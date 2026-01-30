import React, { useState } from 'react';
import Button from '../ui/Button';

const LearningForm = ({ onSubmit, loading }) => {
    const [preferences, setPreferences] = useState({
        skillLevel: 'beginner',
        timeAvailable: '30min',
        learningType: 'video',
    });

    const handleChange = (e) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(preferences);
    };

    const formGroupStyle = {
        marginBottom: '1.5rem',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.75rem',
        fontWeight: '600',
        color: 'var(--secondary-black)',
    };

    const selectStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #d1d5db',
        fontSize: '1rem',
        backgroundColor: 'var(--surface-color)',
        cursor: 'pointer',
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="skillLevel">Current Skill Level</label>
                <select
                    id="skillLevel"
                    name="skillLevel"
                    value={preferences.skillLevel}
                    onChange={handleChange}
                    style={selectStyle}
                >
                    <option value="beginner">Beginner (New to this)</option>
                    <option value="intermediate">Intermediate (Know the basics)</option>
                    <option value="advanced">Advanced (Looking for deep dives)</option>
                </select>
            </div>

            <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="timeAvailable">Daily Study Time</label>
                <select
                    id="timeAvailable"
                    name="timeAvailable"
                    value={preferences.timeAvailable}
                    onChange={handleChange}
                    style={selectStyle}
                >
                    <option value="15min">15 Minutes</option>
                    <option value="30min">30 Minutes</option>
                    <option value="1hour">1 Hour</option>
                    <option value="2hours">2+ Hours</option>
                </select>
            </div>

            <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="learningType">Preferred Learning Style</label>
                <select
                    id="learningType"
                    name="learningType"
                    value={preferences.learningType}
                    onChange={handleChange}
                    style={selectStyle}
                >
                    <option value="video">Video Tutorials</option>
                    <option value="docs">Documentation & Reading</option>
                    <option value="project">Project-Based Learning</option>
                </select>
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Generating Roadmap...' : 'Generate Roadmap'}
            </Button>
        </form>
    );
};

export default LearningForm;
