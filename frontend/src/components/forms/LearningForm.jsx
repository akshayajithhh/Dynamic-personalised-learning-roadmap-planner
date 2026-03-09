import React, { useEffect, useMemo, useState } from 'react';
import Button from '../ui/Button';

const LearningForm = ({ onSubmit, loading, techOptions = [], initialTechId = '' }) => {
    const defaultTechId = useMemo(() => {
        if (initialTechId) return initialTechId;
        return techOptions[0]?._id || techOptions[0]?.name || '';
    }, [initialTechId, techOptions]);

    const [preferences, setPreferences] = useState({
        techId: defaultTechId,
        skillLevel: 'beginner',
        timeAvailable: '30min',
        learningType: 'video',
    });

    useEffect(() => {
        if (!preferences.techId && defaultTechId) {
            setPreferences((prev) => ({ ...prev, techId: defaultTechId }));
        }
    }, [defaultTechId, preferences.techId]);

    const handleChange = (e) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(preferences);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label" htmlFor="techId">Domain / Career Goal</label>
                <select
                    id="techId"
                    name="techId"
                    value={preferences.techId}
                    onChange={handleChange}
                    className="form-control"
                    required
                >
                    {techOptions.map((option) => (
                        <option key={option._id || option.name} value={option._id || option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="skillLevel">Current Skill Level</label>
                <select
                    id="skillLevel"
                    name="skillLevel"
                    value={preferences.skillLevel}
                    onChange={handleChange}
                    className="form-control"
                >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="timeAvailable">Available Learning Time</label>
                <select
                    id="timeAvailable"
                    name="timeAvailable"
                    value={preferences.timeAvailable}
                    onChange={handleChange}
                    className="form-control"
                >
                    <option value="15min">15 Minutes</option>
                    <option value="30min">30 Minutes</option>
                    <option value="1hour">1 Hour</option>
                    <option value="2hours">2+ Hours</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="learningType">Preferred Learning Style</label>
                <select
                    id="learningType"
                    name="learningType"
                    value={preferences.learningType}
                    onChange={handleChange}
                    className="form-control"
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
