import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Resource from '../models/Resource.js';
import { generateRoadmap } from '../services/roadmapEngine.js';

// @desc    Generate a roadmap
// @route   POST /api/roadmap/generate
// @access  Private
export const createRoadmap = async (req, res) => {
    try {
        const { userId, domain } = req.body;
        console.log('[roadmapController] generate request:', { userId, domain });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate skills path
        const skillsPath = await generateRoadmap(
            user._id,
            domain,
            user.skillLevel,
            user.preferredLearningStyle
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

        const skill = await Skill.findById(skillId);
        if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

        // Get resources for this skill
        const resources = await Resource.find({ skillId });

        res.status(200).json({
            success: true,
            data: {
                id: skill._id,
                title: skill.name,
                content: skill.description,
                resources: resources
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
