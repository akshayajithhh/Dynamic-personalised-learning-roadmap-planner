import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'documentation', 'tutorial'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    rating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model('Resource', resourceSchema);
