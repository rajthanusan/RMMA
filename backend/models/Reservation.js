const mongoose = require('mongoose');


const reservationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: String, required: true },  
  time: { type: String, required: true },  
  status: { type: String, default: 'Pending' }, 
}, { timestamps: true });


const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
