const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');


exports.submitFeedback = async (req, res) => {
  const { name, email, feedback } = req.body;

  if (!name || !email || !feedback) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newFeedback = new Feedback({ name, email, feedback });
    await newFeedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); 
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.deleteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.respondToFeedback = async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Response sent successfully.' });
  } catch (error) {
    console.error('Error sending response email:', error);
    res.status(500).json({ error: 'Unable to send response.' });
  }
};
