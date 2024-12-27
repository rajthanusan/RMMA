const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require('nodemailer');
const { sendWelcomeEmail } = require('../services/emailService');


const JWT_SECRET = process.env.JWT_SECRET || '12343211223344';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);  

 
const googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    try {
         
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,  
        });

        const payload = ticket.getPayload();
        const email = payload.email;

         
        let user = await User.findOne({ email });

        if (!user) {
             
            user = new User({
                email,
                username: payload.name || "",  
                googleId: payload.sub,
                role: "user",  
            });
            await user.save();
        }

         
        res.status(200).json({
            message: `Login successful! Welcome, ${user.email}`,
            user: { email: user.email, role: user.role },  
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Google login failed." });
    }
};


 
const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found." });
  
      const resetCode = Math.floor(100000 + Math.random() * 900000);  
      user.resetCode = resetCode;
      user.resetCodeExpires = Date.now() + 15 * 60 * 1000;  
      await user.save();
  
       
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Code",
        text: `Your password reset code is ${resetCode}. This code is valid for 15 minutes.

If you did not request a password reset, please ignore this message or contact our support team for assistance.

Warm regards,  
RMS Team`,
      });
  
      res.status(200).json({ message: "Reset code sent to your email." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred." });
    }
  };
  const verifyCode = async (req, res) => {
    const { email, code } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || user.resetCode !== parseInt(code, 10)) {
        return res.status(400).json({ message: "Invalid reset code." });
      }
  
      if (user.resetCodeExpires < Date.now()) {
        return res.status(400).json({ message: "Reset code has expired." });
      }
  
      res.status(200).json({ message: "Code verified. You can reset your password now." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred." });
    }
  };
  
  const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || user.resetCode !== parseInt(code, 10)) {
        return res.status(400).json({ message: "Invalid reset code." });
      }
  
      if (user.resetCodeExpires < Date.now()) {
        return res.status(400).json({ message: "Reset code has expired." });
      }
  
      user.password = await bcrypt.hash(newPassword, 10);  
      user.resetCode = undefined;  
      user.resetCodeExpires = undefined;  
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred." });
    }
  };
      
  const registerUser = async (req, res) => {
    const { email, password, username, role } = req.body;
  
    try {
       
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
  
       
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword, username, role });
      await newUser.save();
  
       
      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );
  
       
      res.status(201).json({ token, message: 'User registered successfully.' });
  
       
      sendWelcomeEmail(email);
  
    } catch (error) {
      console.error('Error during registration:', error);
       
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error during registration.' });
      }
    }
  };
  
  const registerManager = async (req, res) => {
    const { email, password, username, role } = req.body;
  
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Please provide email, password, and username.' });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword, username, role: role || 'manager' });
      await newUser.save();
  
      const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token, message: 'Manager registration successful.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during registration.' });
    }
  };
  
   
  const editManager = async (req, res) => {
    const { id } = req.params;
    const { email, password, username, role } = req.body;
  
    if (!email && !password && !username && !role) {
      return res.status(400).json({ message: 'Please provide data to update (email, password, username, or role).' });
    }
  
    try {
      const manager = await User.findById(id);
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found.' });
      }
  
      if (email) manager.email = email;
      if (password) manager.password = await bcrypt.hash(password, 10);
      if (username) manager.username = username;   
      if (role) manager.role = role;
  
      await manager.save();
  
      res.status(200).json({ message: 'Manager updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during manager update.' });
    }
  };


const deleteManager = async (req, res) => {
    const { id } = req.params;

    try {
        const manager = await User.findByIdAndDelete(id);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found.' });
        }

        res.status(200).json({ message: 'Manager deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during manager deletion.' });
    }
};

const registerOperator = async (req, res) => {
    const { email, password, username, role } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Please provide email, password, and username.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, username, role: role || 'operator' });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, message: 'Operator registration successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};


const editOperator = async (req, res) => {
    const { id } = req.params;
    const { email, password, username, role } = req.body;

    if (!email && !password && !username && !role) {
        return res.status(400).json({ message: 'Please provide data to update (email, password, username, or role).' });
    }

    try {
        const operator = await User.findById(id);
        if (!operator) {
            return res.status(404).json({ message: 'Operator not found.' });
        }

        if (email) operator.email = email;
        if (password) operator.password = await bcrypt.hash(password, 10);
        if (username) operator.username = username;   
        if (role) operator.role = role;

        await operator.save();

        res.status(200).json({ message: 'Operator updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during operator update.' });
    }
};

const deleteOperator = async (req, res) => {
  const { id } = req.params;

  if (!id) {
      return res.status(400).json({ message: 'ID is required to delete operator.' });
  }

  try {
      const operator = await User.findByIdAndDelete(id);
      if (!operator) {
          return res.status(404).json({ message: 'Operator not found.' });
      }

      res.status(200).json({ message: 'Operator deleted successfully.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during operator deletion.' });
  }
};




const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Login successful.', user: { email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching all users.' });
    }
};

 
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password, role } = req.body;

    if (!email && !password && !role) {
        return res.status(400).json({ message: 'Please provide data to update (email, password, or role).' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (role) user.role = role;

        await user.save();

        res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during user update.' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during user deletion.' });
    }
};

module.exports = {
    registerUser,
    registerManager,
    editManager,
    deleteManager,
    registerOperator,
    editOperator,
    deleteOperator,
    loginUser,
    getAllUsers,
    updateUser,  
    deleteUser, 
    googleLogin, forgotPassword ,resetPassword,verifyCode 
};
