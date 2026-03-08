const express = require('express');
const Hotel = require('../models/Hotel');
const { auth } = require('../middleware/auth');
const router = express.Router();

// جلب كل الفنادق
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('rooms');
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ msg: 'خطأ في السيرفر' });
  }
});

// إضافة فندق جديد (فقط admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'غير مصرح لك' });
    }
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ msg: 'خطأ في السيرفر' });
  }
});

module.exports = router;
