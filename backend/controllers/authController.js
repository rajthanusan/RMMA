const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose'); 

exports.registerUser = async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
      res.status(500).json({ error: 'Server error during login' });
    }
  };

  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find(); 
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error during fetching users' });
    }
  };

  exports.deleteUser = async (req, res) => {
    const { id } = req.params;
  
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
  
    try {
      
      const user = await User.findById(id);
      
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      await user.deleteOne();
  
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      
      console.error('Error during deletion:', error.message);
      
      
      res.status(500).json({ error: 'Server error during deletion' });
    }
  };