const mongoose = require('mongoose');

const stylistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: [{ type: String }],
    experience: { type: Number },
    rating: { type: Number, default: 5.0 },
    avatar: { type: String },
    availability: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        startTime: { type: String, default: '09:00' },
        endTime: { type: String, default: '18:00' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Stylist', stylistSchema);
