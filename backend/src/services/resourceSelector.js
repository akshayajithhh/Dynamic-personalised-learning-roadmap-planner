import Resource from '../models/Resource.js';

export const selectResource = async (skillId, learningStyle, userLevel) => {
    // 1. Find all resources for the skill
    const resources = await Resource.find({ skillId });

    if (!resources || resources.length === 0) return null;

    // 2. Score resources based on preference
    const scoredResources = resources.map(r => {
        let score = 0;
        if (r.type === learningStyle) score += 5; // Strong preference
        if (r.difficulty === userLevel) score += 3;
        score += (r.rating || 0);
        return { resource: r, score };
    });

    // Sort by score descending
    scoredResources.sort((a, b) => b.score - a.score);

    return scoredResources[0].resource;
};
