const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  alt: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Ambiance', 'Food', 'Drinks', 'Customers'], 
  },
  filename: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
