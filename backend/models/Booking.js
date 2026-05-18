const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    stylist: { type: mongoose.Schema.Types.ObjectId, ref: 'Stylist', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Format "HH:mm"
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    totalPrice: { type: Number },
    notes: { type: String }
}, { timestamps: true });

bookingSchema.index(
    { stylist: 1, date: 1, time: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } }
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
