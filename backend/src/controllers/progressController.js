import Progress from '../models/Progress.js';
import Roadmap from '../models/Roadmap.js';

// @desc    Update progress
// @route   POST /api/progress/update
// @access  Private
export const updateProgress = async (req, res) => {
    try {
        const { userId, skillId, status, domain } = req.body;

        console.log('[progressController] updateProgress:', { userId, skillId, status, domain });

        let progress = await Progress.findOne({ userId, skillId });

        if (progress) {
            progress.status = status;
            progress.completionPercentage = status === 'completed' ? 100 : progress.completionPercentage;
            await progress.save();
        } else {
            progress = await Progress.create({
                userId,
                skillId,
                status,
                completionPercentage: status === 'completed' ? 100 : 0
            });
        }

        // Logic to unlock next skill in Roadmap if this one is completed
        if (status === 'completed') {
            // Find roadmap filtered by userId AND domain (if provided)
            let roadmapQuery = { userId };
            if (domain) {
                roadmapQuery.domain = domain;
            }
            
            const roadmap = await Roadmap.findOne(roadmapQuery).sort({ createdAt: -1 });
            
            console.log('[progressController] roadmap found:', roadmap ? 'yes' : 'no', 'query:', roadmapQuery);
            
            if (roadmap) {
                const currentSkillIndex = roadmap.skills.findIndex(s => s.skillId.toString() === skillId);
                console.log('[progressController] currentSkillIndex:', currentSkillIndex);
                
                if (currentSkillIndex !== -1) {
                    // Mark current as completed in roadmap
                    roadmap.skills[currentSkillIndex].status = 'completed';
                    
                    // Unlock next if exists
                    if (currentSkillIndex < roadmap.skills.length - 1) {
                        roadmap.skills[currentSkillIndex + 1].status = 'unlocked';
                        console.log('[progressController] unlocked next skill at index:', currentSkillIndex + 1);
                    }
                    
                    await roadmap.save();
                    console.log('[progressController] roadmap updated successfully');
                } else {
                    console.log('[progressController] WARNING: skillId not found in roadmap skills array');
                }
            } else {
                console.log('[progressController] WARNING: No roadmap found for userId:', userId, 'domain:', domain);
            }
        }

        res.status(200).json({
            success: true,
            data: progress
        });

    } catch (error) {
        console.error('[progressController] updateProgress error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user progress
// @route   GET /api/progress/:userId
// @access  Private
export const getProgress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const progressEntries = await Progress.find({ userId })
            .sort({ updatedAt: -1 })
            .populate({
                path: 'skillId',
                select: 'name level estimatedHours moduleId',
                populate: {
                    path: 'moduleId',
                    select: 'name domainId',
                    populate: {
                        path: 'domainId',
                        select: 'name',
                    },
                },
            });

        // Keep only the newest roadmap per domain for a clean "current progress" view.
        const roadmaps = await Roadmap.find({ userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'skills.skillId',
                select: 'name level estimatedHours moduleId',
                populate: {
                    path: 'moduleId',
                    select: 'name domainId',
                    populate: {
                        path: 'domainId',
                        select: 'name',
                    },
                },
            });

        const latestRoadmapByDomain = new Map();
        for (const roadmap of roadmaps) {
            const domainKey = roadmap.domain || 'Unknown';
            if (!latestRoadmapByDomain.has(domainKey)) {
                latestRoadmapByDomain.set(domainKey, roadmap);
            }
        }

        const progressBySkillId = new Map(
            progressEntries.map((entry) => [String(entry.skillId?._id || entry.skillId), entry])
        );

        const summary = {
            totalSkills: 0,
            completedSkills: 0,
            inProgressSkills: 0,
            unlockedSkills: 0,
            lockedSkills: 0,
            notStartedSkills: 0,
            completionPercentage: 0,
            estimatedHoursSpent: 0,
        };

        const domainsMap = new Map();
        const detailedSkills = [];

        for (const roadmap of latestRoadmapByDomain.values()) {
            const domainName = roadmap.domain || 'Unknown';
            const domainStats = domainsMap.get(domainName) || {
                domain: domainName,
                totalSkills: 0,
                completedSkills: 0,
                inProgressSkills: 0,
                unlockedSkills: 0,
                lockedSkills: 0,
                notStartedSkills: 0,
                completionPercentage: 0,
            };

            for (const item of roadmap.skills || []) {
                const skill = item.skillId;
                if (!skill) continue;

                const progress = progressBySkillId.get(String(skill._id));
                const roadmapStatus = item.status;

                let effectiveStatus = 'not_started';
                if (roadmapStatus === 'completed') {
                    effectiveStatus = 'completed';
                } else if (progress?.status === 'in_progress') {
                    effectiveStatus = 'in_progress';
                } else if (roadmapStatus === 'locked') {
                    effectiveStatus = 'locked';
                }

                summary.totalSkills += 1;
                domainStats.totalSkills += 1;

                if (roadmapStatus !== 'locked') {
                    summary.unlockedSkills += 1;
                    domainStats.unlockedSkills += 1;
                }
                if (roadmapStatus === 'locked') {
                    summary.lockedSkills += 1;
                    domainStats.lockedSkills += 1;
                }

                if (effectiveStatus === 'completed') {
                    summary.completedSkills += 1;
                    domainStats.completedSkills += 1;
                    summary.estimatedHoursSpent += Number(skill.estimatedHours || 0);
                } else if (effectiveStatus === 'in_progress') {
                    summary.inProgressSkills += 1;
                    domainStats.inProgressSkills += 1;
                } else if (effectiveStatus === 'not_started') {
                    summary.notStartedSkills += 1;
                    domainStats.notStartedSkills += 1;
                }

                detailedSkills.push({
                    skillId: skill._id,
                    skillName: skill.name,
                    level: skill.level,
                    status: effectiveStatus,
                    roadmapStatus,
                    completionPercentage: progress?.completionPercentage || (effectiveStatus === 'completed' ? 100 : 0),
                    module: skill.moduleId?.name || 'Unknown Module',
                    domain: domainName,
                    updatedAt: progress?.updatedAt || item.updatedAt || roadmap.updatedAt,
                });
            }

            domainStats.completionPercentage = domainStats.totalSkills
                ? Math.round((domainStats.completedSkills / domainStats.totalSkills) * 100)
                : 0;
            domainsMap.set(domainName, domainStats);
        }

        // Fallback: if roadmap is unavailable, derive a minimal summary from raw progress entries.
        if (summary.totalSkills === 0 && progressEntries.length > 0) {
            summary.totalSkills = progressEntries.length;
            for (const entry of progressEntries) {
                if (entry.status === 'completed') {
                    summary.completedSkills += 1;
                    summary.estimatedHoursSpent += Number(entry.skillId?.estimatedHours || 0);
                } else if (entry.status === 'in_progress') {
                    summary.inProgressSkills += 1;
                } else {
                    summary.notStartedSkills += 1;
                }
                summary.unlockedSkills += 1;
            }
        }

        summary.completionPercentage = summary.totalSkills
            ? Math.round((summary.completedSkills / summary.totalSkills) * 100)
            : 0;

        const recentActivity = progressEntries.slice(0, 10).map((entry) => ({
            skillId: entry.skillId?._id || entry.skillId,
            skillName: entry.skillId?.name || 'Unknown Skill',
            status: entry.status,
            completionPercentage: entry.completionPercentage || 0,
            module: entry.skillId?.moduleId?.name || 'Unknown Module',
            domain: entry.skillId?.moduleId?.domainId?.name || 'Unknown Domain',
            updatedAt: entry.updatedAt,
        }));

        res.status(200).json({
            success: true,
            data: {
                summary,
                domains: Array.from(domainsMap.values()),
                skills: detailedSkills,
                recentActivity,
                // Backward compatibility for old clients expecting an array.
                entries: progressEntries,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
