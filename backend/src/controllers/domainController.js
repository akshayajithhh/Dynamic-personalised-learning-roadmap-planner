import Domain from '../models/Domain.js';

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

        // Basic validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Name and description are required'
            });
        }

        // Prevent duplicate domains by name (case-insensitive)
        const existing = await Domain.findOne({ name });
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
            name,
            description,
            icon,
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
