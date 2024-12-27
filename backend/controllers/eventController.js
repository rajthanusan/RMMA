const mongoose = require('mongoose');
const Event = require('../models/Event');
const { cloudinary } = require('../config/cloudinary');


exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
};


exports.addEvent = async (req, res) => {
  const { eventname, date, time, location } = req.body;

  if (!eventname || !date || !time || !location) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path; 
    }

    const newEvent = new Event({
      eventname,
      date,
      time,
      location,
      image: imageUrl,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Could not add event', details: error.message });
  }
};


exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { eventname, date, time, location } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    
    if (eventname) event.eventname = eventname;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;

    
    if (req.file) {
      
      if (event.image) {
        const publicId = event.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      event.image = req.file.path; 
    }

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Could not update event', details: error.message });
  }
};


exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    
    if (event.image) {
      const publicId = event.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Could not delete event', details: error.message });
  }
};

exports.toggleEventStatus = async (req, res) => {
  const { id } = req.params;

  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    
    event.active = !event.active;
    await event.save();

    
    res.status(200).json({
      id: event._id,
      eventname: event.eventname,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image ? `${req.protocol}://${req.get('host')}/${event.image}` : null,
      active: event.active,
    });
  } catch (error) {
    console.error('Error toggling event status:', error);
    res.status(500).json({ error: 'Error toggling event status', details: error.message });
  }
};
