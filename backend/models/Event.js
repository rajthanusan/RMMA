const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventname: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model('Event', eventSchema);