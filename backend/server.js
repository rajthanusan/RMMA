const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000; 
const MONGO_URI = process.env.MONGO_URI;
   
   
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const imageRoutes = require('./routes/imageRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const mailRoutes = require('./routes/mailRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const roomRoutes = require('./routes/roomRoutes');

const app = express();

app.use(cors());  
app.use(bodyParser.json());
app.use(express.json());



app.use('/auth', authRoutes);
app.use('/api', foodRoutes);
app.use('/api', bookingRoutes);
app.use('/api', eventRoutes);
app.use('/api', reviewRoutes);
app.use('/api/images', imageRoutes);
app.use('/api', aboutRoutes);
app.use('/api', serviceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api', subscribeRoutes);
app.use('/api/rooms', roomRoutes);


mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err)); 

 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});        