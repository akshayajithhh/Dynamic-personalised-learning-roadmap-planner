import Domain from '../models/Domain.js';
import Module from '../models/Module.js';
import Skill from '../models/Skill.js';
import Resource from '../models/Resource.js';
import Roadmap from '../models/Roadmap.js';
import Progress from '../models/Progress.js';

// @desc    Get all domains
// @route   GET /api/domains
// @access  Public
export const getDomains = async (req, res) => {
    try {
        const domains = await Domain.find();
        res.status(200).json({
            success: true,
            data: domains
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new domain
// @route   POST /api/domains
// @access  Private/Admin
export const createDomain = async (req, res) => {
    try {
        const { name, description, icon, technologies } = req.body;
        const normalizedName = typeof name === 'string' ? name.trim() : '';
        const normalizedDescription = typeof description === 'string' ? description.trim() : '';
        const normalizedIcon = typeof icon === 'string' ? icon.trim() : '';

        // Basic validation
        if (!normalizedName || !normalizedDescription) {
            return res.status(400).json({
                success: false,
                message: 'Name and description are required'
            });
        }

        // Prevent duplicate domains by name (case-insensitive)
        const existing = await Domain.findOne({
            name: { $regex: new RegExp(`^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Domain with this name already exists'
            });
        }

        let techArray = [];
        if (Array.isArray(technologies)) {
            techArray = technologies;
        } else if (typeof technologies === 'string') {
            techArray = technologies
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);
        }

        const domain = await Domain.create({
            name: normalizedName,
            description: normalizedDescription,
            icon: normalizedIcon || undefined,
            technologies: techArray
        });

        return res.status(201).json({
            success: true,
            data: domain
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a domain and all nested content
// @route   DELETE /api/domains/:domainId
// @access  Private/Admin
export const deleteDomain = async (req, res) => {
    try {
        const { domainId } = req.params;

        const domain = await Domain.findById(domainId);
        if (!domain) {
            return res.status(404).json({
                success: false,
                message: 'Domain not found',
            });
        }

        const modules = await Module.find({ domainId }).select('_id');
        const moduleIds = modules.map((item) => item._id);

        const skills = await Skill.find({
            $or: [
                { moduleId: { $in: moduleIds } },
                { domain: domain.name },
            ],
        }).select('_id');
        const skillIds = skills.map((item) => item._id);

        await Promise.all([
            Resource.deleteMany({ skillId: { $in: skillIds } }),
            Progress.deleteMany({ skillId: { $in: skillIds } }),
            Skill.deleteMany({ _id: { $in: skillIds } }),
            Module.deleteMany({ _id: { $in: moduleIds } }),
            Roadmap.updateMany(
                { domain: domain.name },
                { $pull: { skills: { skillId: { $in: skillIds } } } }
            ),
            Roadmap.deleteMany({ domain: domain.name }),
        ]);

        await domain.deleteOne();

        return res.status(200).json({
            success: true,
            data: { domainId, deleted: true },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
