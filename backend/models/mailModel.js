// /models/mailModel.js
const mongoose = require('mongoose');

const MailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  mailType: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Mail = mongoose.model('Mail', MailSchema);

module.exports = Mail;
