const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Stylist = require('../models/Stylist');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.createBooking = async (req, res) => {
    try {
        const { service, stylist, date, time, notes } = req.body;

        if (!mongoose.Types.ObjectId.isValid(service) || !mongoose.Types.ObjectId.isValid(stylist)) {
            return res.status(400).json({ message: 'Invalid service or stylist selection.' });
        }

        // Check if the stylist is already booked at that time and date
        const existingBooking = await Booking.findOne({
            stylist,
            date,
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Stylist is already booked for this time slot' });
        }

        const booking = await Booking.create({
            user: req.user.id,
            service,
            stylist,
            date,
            time,
            notes
        });

        // Populate booking for email
        await booking.populate('service stylist');

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: req.user.email,
            subject: 'Booking Confirmation - Salon Luxe',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #7c3aed;">Booking Confirmed!</h2>
                    <p>Dear ${req.user.name},</p>
                    <p>Your appointment has been successfully booked. Here are the details:</p>
                    <ul>
                        <li><strong>Service:</strong> ${booking.service.name}</li>
                        <li><strong>Stylist:</strong> ${booking.stylist.name}</li>
                        <li><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</li>
                        <li><strong>Time:</strong> ${booking.time}</li>
                    </ul>
                    <p>We look forward to seeing you!</p>
                    <p>Best regards,<br>Salon Luxe Team</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Email error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('service')
            .populate('stylist');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('service')
            .populate('stylist');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAvailableSlots = async (req, res) => {
    try {
        const { stylistId, date } = req.query;
        // Simple logic: return slots from 09:00 to 18:00 hourly
        // Excluding already booked slots
        const slots = [
            '09:00', '10:00', '11:00', '12:00', '13:00', 
            '14:00', '15:00', '16:00', '17:00'
        ];

        const bookedSlots = await Booking.find({
            stylist: stylistId,
            date: new Date(date),
            status: { $in: ['pending', 'confirmed'] }
        }).select('time');

        const bookedTimes = bookedSlots.map(b => b.time);
        const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));

        res.json(availableSlots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
