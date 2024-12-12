const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: String, required: true },  
  time: { type: String, required: true },  
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
