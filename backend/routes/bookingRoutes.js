const express = require('express');
const router = express.Router();
const { createBooking, getBookings, deleteBooking, regcreateBooking, approveReservation, rejectReservation } = require('../controllers/bookingController');

router.post('/book-table', createBooking);
router.post('/reg-book-table', regcreateBooking);
router.get('/bookings', getBookings);
router.put('/bookings/:id/approve', approveReservation);
router.put('/bookings/:id/reject', rejectReservation);
router.delete('/bookings/:id', deleteBooking);

module.exports = router;
