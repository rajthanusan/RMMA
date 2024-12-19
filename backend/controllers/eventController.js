const mongoose = require('mongoose');
const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events', details: error.message });
  }
};

exports.addEvent = async (req, res) => {
  const { eventname, date, time, location } = req.body;

  if (!eventname || !date || !time || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
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
      image: imageUrl,
      location,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error adding event', details: error.message });
  }
};
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { eventname, date, time, location } = req.body;

  try {
    const updateData = { eventname, date, time, location };

    
    if (req.file) {
      updateData.image = req.file.path; 

      
      const oldEvent = await Event.findById(id);
      if (oldEvent && oldEvent.image) {
        const publicId = oldEvent.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event', details: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (deletedEvent.image) {
      fs.unlink(path.join(__dirname, '..', deletedEvent.image), (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
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
    res.status(500).json({ error: 'Error toggling event status', details: error.message });
  }
};
