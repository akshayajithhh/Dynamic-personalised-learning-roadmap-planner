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
        const progress = await Progress.find({ userId: req.params.userId });
        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
