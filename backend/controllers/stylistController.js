const Stylist = require('../models/Stylist');

exports.getStylists = async (req, res) => {
    try {
        const stylists = await Stylist.find();
        res.json(stylists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createStylist = async (req, res) => {
    try {
        const stylist = await Stylist.create(req.body);
        res.status(201).json(stylist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStylist = async (req, res) => {
    try {
        const stylist = await Stylist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(stylist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteStylist = async (req, res) => {
    try {
        await Stylist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Stylist removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
