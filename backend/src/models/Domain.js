import mongoose from 'mongoose';

const domainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'default-icon.png'
    },
    technologies: [{
        type: String
    }]
}, {
    timestamps: true
});

export default mongoose.model('Domain', domainSchema);
