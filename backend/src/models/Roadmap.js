import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    skills: [{
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: true
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resource',
            required: true
        },
        status: {
            type: String,
            enum: ['locked', 'unlocked', 'completed'],
            default: 'locked'
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('Roadmap', roadmapSchema);
