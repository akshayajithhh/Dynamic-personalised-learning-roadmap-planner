import Skill from '../models/Skill.js';
import Domain from '../models/Domain.js';
import Module from '../models/Module.js';
import Resource from '../models/Resource.js';
import mongoose from 'mongoose';
import { selectResource } from './resourceSelector.js';

const capstoneNameFor = (domainName, level) => `${domainName} Capstone Project (${level})`;

const ensureCapstoneResources = async (skillDoc, domainName, skillLevel) => {
    const existing = await Resource.find({ skillId: skillDoc._id });
    if (existing.length >= 3) return;

    const query = encodeURIComponent(`${domainName} ${skillDoc.name}`);
    const candidates = [
        {
            skillId: skillDoc._id,
            title: `${domainName} Capstone Documentation Guide`,
            type: 'documentation',
            url: `https://www.google.com/search?q=${encodeURIComponent(`${domainName} capstone project architecture guide`)}`,
            difficulty: skillLevel,
            rating: 4.5,
        },
        {
            skillId: skillDoc._id,
            title: `${domainName} Capstone YouTube Course`,
            type: 'video',
            url: `https://www.youtube.com/results?search_query=${query}`,
            difficulty: skillLevel,
            rating: 4.5,
        },
        {
            skillId: skillDoc._id,
            title: `${domainName} Capstone Hands-on Tutorial`,
            type: 'tutorial',
            url: `https://www.freecodecamp.org/news/search?query=${encodeURIComponent(`${domainName} project`)}`,
            difficulty: skillLevel,
            rating: 4.4,
        },
    ];

    const usedUrls = new Set(existing.map((r) => r.url));
    const inserts = candidates.filter((c) => !usedUrls.has(c.url));
    if (inserts.length > 0) {
        await Resource.insertMany(inserts);
    }
};

const ensureCapstoneSkill = async ({ domainDoc, domainName, skillLevel, fallbackModuleId }) => {
    const capstoneName = capstoneNameFor(domainName, skillLevel);

    let capstone = await Skill.findOne({
        domain: domainName,
        name: capstoneName,
        level: skillLevel,
    });

    if (!capstone) {
        let moduleId = fallbackModuleId || null;
        if (!moduleId && domainDoc?._id) {
            const lastModule = await Module.findOne({ domainId: domainDoc._id }).sort({ order: -1 });
            moduleId = lastModule?._id || null;
        }

        if (!moduleId) return null;

        capstone = await Skill.create({
            name: capstoneName,
            description: `Build an end-to-end ${domainName} project that demonstrates ${skillLevel.toLowerCase()} level competency.`,
            domain: domainName,
            moduleId,
            level: skillLevel,
            estimatedHours: skillLevel === 'Advanced' ? 16 : skillLevel === 'Intermediate' ? 12 : 8,
            prerequisites: [],
        });
    }

    await ensureCapstoneResources(capstone, domainName, skillLevel);
    return capstone;
};

export const generateRoadmap = async (userId, domain, skillLevel, learningStyle) => {
    // domain can be either:
    // - Domain _id (ObjectId string) coming from frontend route params
    // - Domain name string (older/mock data)
    let domainName = domain;
    let domainDoc = null;
    try {
        if (mongoose.Types.ObjectId.isValid(domain)) {
            domainDoc = await Domain.findById(domain);
            if (domainDoc?.name) {
                domainName = domainDoc.name;
            }
        } else {
            domainDoc = await Domain.findOne({ name: domain });
        }
    } catch (e) {
        // ignore lookup errors; fall back to raw domain
    }

    console.log('[roadmapEngine] domain received:', domain, '-> domainName used for skills query:', domainName);

    const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let skills = [];

    // Prefer module-based lookup when we have a Domain document
    if (domainDoc) {
        const modules = await Module.find({ domainId: domainDoc._id }).sort({ order: 1 });
        console.log('[roadmapEngine] modules found for domain:', modules.length);

        if (modules.length > 0) {
            const moduleIds = modules.map((m) => m._id);
            skills = await Skill.find({ moduleId: { $in: moduleIds } });
        }
    }

    // Fallback: older data / safety - use domain string on Skill
    if (!skills || skills.length === 0) {
        skills = await Skill.find({
            domain: { $regex: new RegExp(`^${escapeRegex(domainName)}$`, 'i') },
        });
    }

    console.log('[roadmapEngine] skills found for domain (pre-filter):', skills.length);

    // Filter skills based on user skill level
    const originalSkillsCount = skills.length;
    const allowedLevels =
        skillLevel === 'Advanced'
            ? ['Beginner', 'Intermediate', 'Advanced']
            : skillLevel === 'Intermediate'
                ? ['Beginner', 'Intermediate']
                : ['Beginner'];

    skills = skills.filter((s) => allowedLevels.includes(s.level));
    console.log('[roadmapEngine] skillLevel:', skillLevel, 'allowedLevels:', allowedLevels, 'after level filter:', skills.length);

    // Safety: if filtering removed everything, fall back to unfiltered domain skills
    if (skills.length === 0 && originalSkillsCount > 0) {
        console.log('[roadmapEngine] WARNING: level filter removed all skills; falling back to all domain skills');
        skills = await Skill.find({
            domain: { $regex: new RegExp(`^${escapeRegex(domainName)}$`, 'i') },
        });
    }

    // Keep capstone out of the main ordering and append it explicitly at the end.
    skills = skills.filter((s) => !String(s.name).includes('Capstone Project ('));

    // Sort skills by level
    const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    skills.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
    console.log('[roadmapEngine] skills after sorting (first 5):', skills.slice(0, 5).map((s) => `${s.name} (${s.level})`));

    // Select one best resource for each roadmap step
    const roadmapSkills = [];

    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        const resource = await selectResource(skill._id, learningStyle, skillLevel);

        if (!resource) {
            console.log('[roadmapEngine] No resource found for skill:', skill.name, 'skillId:', String(skill._id));
            continue;
        }

        roadmapSkills.push({
            skillId: skill._id,
            resourceId: resource._id,
            status: i === 0 ? 'unlocked' : 'locked',
        });
    }

    // Ensure roadmap ends with a project matching the selected user level.
    const fallbackModuleId = skills.length > 0 ? skills[skills.length - 1].moduleId : null;
    const capstoneSkill = await ensureCapstoneSkill({
        domainDoc,
        domainName,
        skillLevel,
        fallbackModuleId,
    });

    if (capstoneSkill) {
        const capstoneResource = await selectResource(capstoneSkill._id, learningStyle, skillLevel);
        if (capstoneResource) {
            roadmapSkills.push({
                skillId: capstoneSkill._id,
                resourceId: capstoneResource._id,
                status: roadmapSkills.length === 0 ? 'unlocked' : 'locked',
            });
        }
    }

    console.log('[roadmapEngine] final roadmapSkills length:', roadmapSkills.length);
    return roadmapSkills;
};
