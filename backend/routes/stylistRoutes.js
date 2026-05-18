const express = require('express');
const { getStylists, createStylist, updateStylist, deleteStylist } = require('../controllers/stylistController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getStylists);
router.post('/', protect, admin, createStylist);
router.put('/:id', protect, admin, updateStylist);
router.delete('/:id', protect, admin, deleteStylist);

module.exports = router;
