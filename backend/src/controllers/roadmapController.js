import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Resource from '../models/Resource.js';
import { generateRoadmap } from '../services/roadmapEngine.js';

const buildStudyGuidance = ({ level, learningStyle, availableTimePerWeek }) => {
    const safeLevel = ['Beginner', 'Intermediate', 'Advanced'].includes(level) ? level : 'Beginner';
    const safeStyle = learningStyle || 'mixed';
    const hoursPerWeek = Number(availableTimePerWeek || 6);

    const levelTips = {
        Beginner: [
            'Focus on fundamentals first and avoid jumping across too many topics in one week.',
            'Study in short sessions and finish one tiny practical task after each session.',
            'Revise previous concepts before starting the next module to improve retention.'
        ],
        Intermediate: [
            'Use a 70/30 split: 70% implementation practice, 30% theory and reference reading.',
            'After each topic, build a mini-feature that combines at least two prior concepts.',
            'Track mistakes in a short log and revisit them at the end of the week.'
        ],
        Advanced: [
            'Use project-first learning and only read docs when blocked on design decisions.',
            'Practice tradeoff analysis: performance, security, maintainability, and scalability.',
            'Do one weekly deep-dive where you refactor or optimize an existing implementation.'
        ]
    };

    const styleTips = {
        video: 'Watch at 1.0-1.25x speed and pause frequently to reproduce what is shown.',
        documentation: 'Read docs actively: copy examples, run them, and annotate important sections.',
        tutorial: 'Prefer end-to-end exercises and do not copy-paste code without modification.',
        mixed: 'Combine one concept resource with one hands-on resource in every study block.'
    };

    const suggestedSplit =
        hoursPerWeek <= 3
            ? '3 sessions x ~45 minutes'
            : hoursPerWeek <= 7
                ? '4-5 sessions x ~60 minutes'
                : '5-6 sessions x ~75 minutes';

    return {
        level: safeLevel,
        learningStyle: safeStyle,
        recommendedCadence: suggestedSplit,
        tips: [
            ...levelTips[safeLevel],
            styleTips[safeStyle] || styleTips.mixed,
            'At the end of each week, summarize what you learned in 5 bullet points and plan next actions.'
        ]
    };
};

const buildSupplementalResources = (skill, existingResources = [], targetLevel = 'Beginner') => {
    const minResourceCount = 4;
    if (existingResources.length >= minResourceCount) return [];

    const query = encodeURIComponent(`${skill.name} ${skill.domain}`);
    const candidates = [
        {
            title: `YouTube Learning Playlist: ${skill.name}`,
            type: 'video',
            url: `https://www.youtube.com/results?search_query=${query}`,
            difficulty: targetLevel,
            rating: 4.4,
            isSuggested: true,
        },
        {
            title: `Official Docs and References: ${skill.name}`,
            type: 'documentation',
            url: `https://www.google.com/search?q=${encodeURIComponent(`${skill.name} official documentation`)}`,
            difficulty: targetLevel,
            rating: 4.3,
            isSuggested: true,
        },
        {
            title: `Hands-on Tutorials: ${skill.name}`,
            type: 'tutorial',
            url: `https://www.freecodecamp.org/news/search?query=${encodeURIComponent(skill.name)}`,
            difficulty: targetLevel,
            rating: 4.5,
            isSuggested: true,
        },
    ];

    const usedUrls = new Set(existingResources.map((r) => r.url));
    return candidates.filter((c) => !usedUrls.has(c.url)).slice(0, minResourceCount - existingResources.length);
};

// @desc    Generate a roadmap
// @route   POST /api/roadmap/generate
// @access  Private
export const createRoadmap = async (req, res) => {
    try {
        const { userId, domain, skillLevel, learningStyle, learningType, timeAvailable } = req.body;
        console.log('[roadmapController] generate request:', { userId, domain, skillLevel, learningStyle, learningType, timeAvailable });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const normalizeSkillLevel = (level) => {
            const map = {
                beginner: 'Beginner',
                intermediate: 'Intermediate',
                advanced: 'Advanced',
            };
            return map[String(level || '').toLowerCase()] || null;
        };

        const normalizeLearningStyle = (style) => {
            const map = {
                video: 'video',
                docs: 'documentation',
                documentation: 'documentation',
                project: 'tutorial',
                tutorial: 'tutorial',
                mixed: 'mixed',
            };
            return map[String(style || '').toLowerCase()] || null;
        };

        const timePerWeekMap = {
            '15min': 2,
            '30min': 4,
            '1hour': 7,
            '2hours': 14,
        };

        const effectiveSkillLevel = normalizeSkillLevel(skillLevel) || user.skillLevel;
        const effectiveLearningStyle = normalizeLearningStyle(learningStyle || learningType) || user.preferredLearningStyle;
        const effectiveAvailableTimePerWeek = timePerWeekMap[timeAvailable] || user.availableTimePerWeek;

        // Persist latest preferences so future generations are consistent with user choices.
        user.skillLevel = effectiveSkillLevel;
        user.preferredLearningStyle = effectiveLearningStyle;
        user.availableTimePerWeek = effectiveAvailableTimePerWeek;
        await user.save();

        // Generate skills path
        const skillsPath = await generateRoadmap(
            user._id,
            domain,
            effectiveSkillLevel,
            effectiveLearningStyle
        );

        console.log('[roadmapController] skillsPath length:', skillsPath.length);
        if (!skillsPath || skillsPath.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No skills/resources found for this domain. Check domain value and seeded skills/resources.'
            });
        }

        // Save roadmap
        const roadmap = await Roadmap.create({
            userId,
            domain,
            skills: skillsPath
        });

        res.status(201).json({
            success: true,
            data: roadmap
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user roadmap
// @route   GET /api/roadmap/:userId
// @access  Private
export const getRoadmap = async (req, res) => {
    try {
        const { userId } = req.params;
        const { domain } = req.query; // Support filtering by domain

        let query = { userId };
        if (domain) {
            query.domain = domain;
        }
        console.log('[roadmapController] getRoadmap query:', query);

        // Find one roadmap (most recent or matching domain)
        const roadmap = await Roadmap.findOne(query)
            .sort({ createdAt: -1 })
            .populate('skills.skillId')
            .populate('skills.resourceId');

        if (!roadmap) {
            // Check if ANY roadmap exists for user to give better error or empty list
            const anyRoadmap = await Roadmap.findOne({ userId });
            if (!anyRoadmap) {
                return res.status(404).json({ success: false, message: 'No roadmap found for user' });
            }
            // If domain specific didn't match, return empty skills or 404
            return res.status(200).json({ success: true, data: { skills: [] } });
        }

        console.log('[roadmapController] roadmap found skills length:', roadmap.skills?.length || 0);
        res.status(200).json({
            success: true,
            data: roadmap
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get specific skill details from roadmap (or general)
// @route   GET /api/roadmap/skill/:skillId
// @access  Private
export const getSkillDetails = async (req, res) => {
    try {
        const { skillId } = req.params;
        const { userId } = req.query;

        const skill = await Skill.findById(skillId);
        if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

        // Get resources for this skill
        const resources = await Resource.find({ skillId }).sort({ rating: -1, createdAt: -1 });
        const user = userId ? await User.findById(userId).select('skillLevel preferredLearningStyle availableTimePerWeek') : null;

        const effectiveLevel = user?.skillLevel || skill.level || 'Beginner';
        const studyGuidance = buildStudyGuidance({
            level: effectiveLevel,
            learningStyle: user?.preferredLearningStyle || 'mixed',
            availableTimePerWeek: user?.availableTimePerWeek || 6,
        });

        const supplementalResources = buildSupplementalResources(skill, resources, effectiveLevel);
        const allResources = [...resources.map((r) => r.toObject()), ...supplementalResources];

        res.status(200).json({
            success: true,
            data: {
                id: skill._id,
                title: skill.name,
                content: skill.description,
                level: skill.level,
                resources: allResources,
                studyTips: studyGuidance,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
