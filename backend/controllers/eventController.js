const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    const eventsWithFullImageUrl = events.map(item => ({
      ...item.toObject(),
      image: `${req.protocol}://${req.get('host')}/${item.image}`,
    }));
    res.status(200).json(eventsWithFullImageUrl);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};

exports.addEvent = async (req, res) => {
  const { eventname, date, time, location } = req.body;

  if (!eventname || !date || !time || !location || !req.file) {
    return res.status(400).json({ error: 'Missing required fields or image' });
  }

  try {
    const imagePath = req.file.path.replace(/\\/g, '/');
    const newEvent = new Event({
      eventname,
      date,
      time,
      image: imagePath,
      location,
    });

    await newEvent.save();
    res.status(201).json({
      ...newEvent.toObject(),
      image: `${req.protocol}://${req.get('host')}/${imagePath}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error adding event' });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { eventname, date, time, location } = req.body;

  try {
    let updateData = { eventname, date, time, location };

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, '/');
      updateData.image = imagePath;

      const oldEvent = await Event.findById(id);
      if (oldEvent && oldEvent.image) {
        fs.unlink(path.join(__dirname, '..', oldEvent.image), (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({
      ...updatedEvent.toObject(),
      image: `${req.protocol}://${req.get('host')}/${updatedEvent.image}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating event' });
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

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.active = !event.active;
    await event.save();

    res.status(200).json({
      ...event.toObject(),
      image: `${req.protocol}://${req.get('host')}/${event.image}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error toggling event status' });
  }
};