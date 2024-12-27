
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  person: { type: String, required: true },
  reservationDate: { type: String, required: true },
  time: { type: String, required: true },
  message: { type: String, required: false },
  status: { type: String, default: 'Pending' }, 
});

module.exports = mongoose.model('Booking', bookingSchema);
