const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventname: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  image: { type: String },
  location: { type: String, required: true },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Event', eventSchema);
