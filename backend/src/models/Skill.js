import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String, // Description for module content
        default: 'Learn the fundamentals and advanced concepts of this skill.',
    },
    // Human-readable domain name (kept for backward compatibility and simple querying)
    domain: {
        type: String,
        required: true,
    },
    // New: module reference to support Domain -> Module -> Skill hierarchy
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true,
    },
    estimatedHours: {
        type: Number,
        default: 4,
    },
    // Prerequisites stored as Skill ObjectId references (optional)
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
    }],
}, {
    timestamps: true,
});

export default mongoose.model('Skill', skillSchema);
