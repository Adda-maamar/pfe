const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { auth } = require('../middleware/auth');
const router = express.Router();

// إنشاء حجز جديد
router.post('/', auth, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    const room = await Room.findById(roomId);
    if (!room || !room.available) {
      return res.status(400).json({ msg: 'الغرفة غير متوفرة' });
    }

    const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    const totalPrice = days * room.price;

    const booking = new Booking({
      user: req.user._id,
      room: roomId,
      checkIn,
      checkOut,
      totalPrice
    });

    room.available = false;
    await room.save();
    await booking.save();

    res.status(201).json({ msg: 'تم الحجز بنجاح', booking });
  } catch (error) {
    res.status(500).json({ msg: 'خطأ في السيرفر' });
  }
});

// حجوزات المستخدم الحالي
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'roomNumber type price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ msg: 'خطأ في السيرفر' });
  }
});

module.exports = router;
