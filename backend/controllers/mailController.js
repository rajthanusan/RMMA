
const nodemailer = require('nodemailer');
const Mail = require('../models/mailModel'); 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
  },
});


exports.sendMail = async (req, res) => {
  const { email, subject, message } = req.body;

  
  const newMail = new Mail({
    email,
    mailType: 'Customer Query', 
    message,
  });

  try {
    
    await newMail.save();

    
    const mailOptions = {
      from: 'rajthanusan08@gmail.com', 
      to: email,                    
      subject: subject,             
      text: message,                
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
      }
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ success: true, message: 'Email sent successfully' });
    });

  } catch (error) {
    console.error('Error handling mail:', error);
    return res.status(500).json({ success: false, message: 'Failed to process mail' });
  }
};
