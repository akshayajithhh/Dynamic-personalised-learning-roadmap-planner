import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    domainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Domain',
        required: true,
    },
    order: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Module', moduleSchema);

