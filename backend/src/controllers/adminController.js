import Domain from '../models/Domain.js';
import Module from '../models/Module.js';
import Skill from '../models/Skill.js';
import Resource from '../models/Resource.js';

const buildOverview = async () => {
    const [domains, modules, skills, resources] = await Promise.all([
        Domain.find().sort({ name: 1 }).lean(),
        Module.find().sort({ order: 1, name: 1 }).lean(),
        Skill.find().sort({ level: 1, name: 1 }).lean(),
        Resource.find().sort({ rating: -1, createdAt: -1 }).lean(),
    ]);

    const resourcesBySkillId = new Map();
    for (const resource of resources) {
        const key = String(resource.skillId);
        const list = resourcesBySkillId.get(key) || [];
        list.push(resource);
        resourcesBySkillId.set(key, list);
    }

    const skillsByModuleId = new Map();
    for (const skill of skills) {
        const key = String(skill.moduleId);
        const list = skillsByModuleId.get(key) || [];
        list.push({
            ...skill,
            resources: resourcesBySkillId.get(String(skill._id)) || [],
        });
        skillsByModuleId.set(key, list);
    }

    const modulesByDomainId = new Map();
    for (const moduleDoc of modules) {
        const key = String(moduleDoc.domainId);
        const list = modulesByDomainId.get(key) || [];
        list.push({
            ...moduleDoc,
            skills: skillsByModuleId.get(String(moduleDoc._id)) || [],
        });
        modulesByDomainId.set(key, list);
    }

    return domains.map((domain) => ({
        ...domain,
        modules: modulesByDomainId.get(String(domain._id)) || [],
    }));
};

export const getAdminOverview = async (req, res) => {
    try {
        const data = await buildOverview();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const createModule = async (req, res) => {
    try {
        const { domainId, name, description, order } = req.body;

        if (!domainId || !name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Domain, module name, and description are required',
            });
        }

        const domain = await Domain.findById(domainId);
        if (!domain) {
            return res.status(404).json({ success: false, message: 'Domain not found' });
        }

        const existing = await Module.findOne({
            domainId,
            name: { $regex: new RegExp(`^${String(name).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Module already exists for this domain' });
        }

        const moduleDoc = await Module.create({
            domainId,
            name: String(name).trim(),
            description: String(description).trim(),
            order: Number(order) || 1,
        });

        return res.status(201).json({ success: true, data: moduleDoc });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const createSkill = async (req, res) => {
    try {
        const { moduleId, name, description, level, estimatedHours } = req.body;

        if (!moduleId || !name || !description || !level) {
            return res.status(400).json({
                success: false,
                message: 'Module, skill name, description, and level are required',
            });
        }

        const moduleDoc = await Module.findById(moduleId).populate('domainId');
        if (!moduleDoc) {
            return res.status(404).json({ success: false, message: 'Module not found' });
        }

        const domainName = moduleDoc.domainId?.name;
        if (!domainName) {
            return res.status(400).json({ success: false, message: 'Module domain is invalid' });
        }

        const existing = await Skill.findOne({
            moduleId,
            name: { $regex: new RegExp(`^${String(name).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Skill already exists for this module' });
        }

        const skill = await Skill.create({
            moduleId,
            name: String(name).trim(),
            description: String(description).trim(),
            domain: domainName,
            level,
            estimatedHours: Number(estimatedHours) || 4,
            prerequisites: [],
        });

        return res.status(201).json({ success: true, data: skill });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const createResource = async (req, res) => {
    try {
        const { skillId, title, type, url, difficulty, rating } = req.body;

        if (!skillId || !title || !type || !url || !difficulty) {
            return res.status(400).json({
                success: false,
                message: 'Skill, title, type, url, and difficulty are required',
            });
        }

        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }

        const resource = await Resource.create({
            skillId,
            title: String(title).trim(),
            type,
            url: String(url).trim(),
            difficulty,
            rating: Number(rating) || 0,
        });

        return res.status(201).json({ success: true, data: resource });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
