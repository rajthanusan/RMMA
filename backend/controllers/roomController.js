const Room = require('../models/Room');

 
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error });
  }
};

 
const addRoom = async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ message: 'Name and Type are required' });
  }
  try {
    const newRoom = await Room.create({ name, type });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error adding room', error });
  }
};

 
const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { name, type },
      { new: true }  
    );
    if (!updatedRoom) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error });
  }
};

 
const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error });
  }
};

module.exports = { getRooms, addRoom, updateRoom, deleteRoom };
