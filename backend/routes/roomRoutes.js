 
const express = require('express');
const router = express.Router();
const { getRooms, addRoom, updateRoom, deleteRoom } = require('../controllers/roomController');

 
router.get('/', getRooms);

 
router.post('/', addRoom);

 
router.put('/:id', updateRoom);

 
router.delete('/:id', deleteRoom);

module.exports = router;
