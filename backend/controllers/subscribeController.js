const Subscription = require('../models/Subscription');
const emailService = require('../services/emailService');

exports.sendMessageToAll = async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  try {
    const subscribers = await Subscription.find({});
    const emails = subscribers.map(sub => sub.email);

    if (emails.length === 0) {
      return res.status(404).json({ message: 'No subscribers found' });
    }

    await emailService.sendEmailToMultipleRecipients(emails, subject, message);

    return res.status(200).json({ message: 'Message successfully sent to all subscribers!' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Failed to send message to subscribers. Please try again later.' });
  }
};

exports.subscribe = async (req, res) => {
  const { email } = req.body;

  try {
     
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

     
    const newSubscription = new Subscription({ email });
    await newSubscription.save();

     
    await emailService.sendSubscriptionConfirmationEmail(email);

     
    return res.status(200).json({
      message: 'Subscription successful. A confirmation email has been sent!',
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    return res.status(500).json({
      message: 'Server error, please try again later',
    });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find(); 
    return res.status(200).json(subscriptions); 
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
};

exports.unsubscribe = async (req, res) => {
  const { email } = req.body;

  try {
    const deletedSubscription = await Subscription.findOneAndDelete({ email });
    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Email not found' });
    }

    return res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
};
