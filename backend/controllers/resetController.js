const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/userModel'); // Adjust the path to your User model

// Handle Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Generate a random 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // Valid for 15 minutes
    await user.save();

    // Send reset code via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is ${resetCode}. This code is valid for 15 minutes.`,
    });

    res.status(200).json({ message: 'Reset code sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};

// Handle Verify Code
const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== parseInt(code, 10)) {
      return res.status(400).json({ message: 'Invalid reset code.' });
    }

    if (user.resetCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Reset code has expired.' });
    }

    res.status(200).json({ message: 'Code verified. You can reset your password now.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};

// Handle Reset Password
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== parseInt(code, 10)) {
      return res.status(400).json({ message: 'Invalid reset code.' });
    }

    if (user.resetCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Reset code has expired.' });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined; // Clear the reset code
    user.resetCodeExpires = undefined; // Clear the code expiration
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};

module.exports = { forgotPassword, verifyCode, resetPassword };
