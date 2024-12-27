
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String, required: true },
  feedbackType: { type: String, enum: ['review','general', 'suggestion', 'complaint', 'other'], required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
