import Skill from '../models/Skill.js';
import Domain from '../models/Domain.js';
import Module from '../models/Module.js';
import mongoose from 'mongoose';
import { selectResource } from './resourceSelector.js';

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

    // 1️⃣ Prefer module-based lookup when we have a Domain document
    if (domainDoc) {
        const modules = await Module.find({ domainId: domainDoc._id }).sort({ order: 1 });
        console.log('[roadmapEngine] modules found for domain:', modules.length);

        if (modules.length > 0) {
            const moduleIds = modules.map((m) => m._id);
            skills = await Skill.find({ moduleId: { $in: moduleIds } });
        }
    }

    // Fallback: older data / safety – use domain string on Skill
    if (!skills || skills.length === 0) {
        skills = await Skill.find({
            domain: { $regex: new RegExp(`^${escapeRegex(domainName)}$`, 'i') },
        });
    }

    console.log('[roadmapEngine] skills found for domain (pre-filter):', skills.length);

    // 2️⃣ Filter skills based on user skill level
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

    // 3️⃣ Sort skills using simple level-based ordering
    const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    skills.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
    console.log('[roadmapEngine] skills after sorting (first 5):', skills.slice(0, 5).map((s) => `${s.name} (${s.level})`));

    // 4️⃣ Select learning resource for each skill
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

    console.log('[roadmapEngine] final roadmapSkills length:', roadmapSkills.length);
    return roadmapSkills;
};
