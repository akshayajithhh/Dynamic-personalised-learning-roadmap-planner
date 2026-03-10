import mongoose from 'mongoose';
import Domain from '../models/Domain.js';

export const resolveDomainContext = async (domainValue) => {
    if (!domainValue) {
        return { raw: '', domainDoc: null, normalizedName: '' };
    }

    const raw = String(domainValue).trim();
    if (!raw) {
        return { raw: '', domainDoc: null, normalizedName: '' };
    }

    let domainDoc = null;
    if (mongoose.Types.ObjectId.isValid(raw)) {
        domainDoc = await Domain.findById(raw);
    }

    if (!domainDoc) {
        domainDoc = await Domain.findOne({
            name: { $regex: new RegExp(`^${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        });
    }

    return {
        raw,
        domainDoc,
        normalizedName: domainDoc?.name || raw,
    };
};
