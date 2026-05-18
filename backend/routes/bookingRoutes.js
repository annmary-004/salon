const express = require('express');
const { 
    createBooking, 
    getMyBookings, 
    getAllBookings, 
    updateBookingStatus,
    getAvailableSlots 
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/all', protect, admin, getAllBookings);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.get('/slots', getAvailableSlots);

module.exports = router;
