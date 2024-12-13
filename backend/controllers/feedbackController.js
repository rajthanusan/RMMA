const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  const { name, email, feedback } = req.body;

  if (!name || !email || !feedback) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newFeedback = new Feedback({ name, email, feedback });
    await newFeedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); 
    res.status(200).json(feedbacks); 
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteFeedback = async (req, res) => {
  const { id } = req.params; 

  try {
    const feedback = await Feedback.findByIdAndDelete(id); 

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' }); 
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
