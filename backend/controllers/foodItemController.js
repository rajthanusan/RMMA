const FoodItem = require('../models/FoodItem');
const fs = require('fs');
const path = require('path');

exports.getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    const foodItemsWithFullImageUrl = foodItems.map(item => ({
      ...item.toObject(),
      image: `${req.protocol}://${req.get('host')}/${item.image}`
    }));
    res.status(200).json(foodItemsWithFullImageUrl);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching food items' });
  }
};

exports.addFoodItem = async (req, res) => {
  const { name, rating, category } = req.body;

  if (!name || !rating || !category || !req.file) {
    return res.status(400).json({ error: 'Missing required fields or image' });
  }

  try {
    const imagePath = req.file.path.replace(/\\/g, '/'); 
    const newFoodItem = new FoodItem({
      name,
      rating,
      category,
      image: imagePath,
    });

    await newFoodItem.save();
    res.status(201).json({
      ...newFoodItem.toObject(),
      image: `${req.protocol}://${req.get('host')}/${imagePath}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Error adding food item' });
  }
};

exports.updateFoodItem = async (req, res) => {
  const { id } = req.params;
  const { name, rating, category } = req.body;

  try {
    let updateData = { name, rating, category };

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, '/');
      updateData.image = imagePath;

    
      const oldItem = await FoodItem.findById(id);
      if (oldItem && oldItem.image) {
        fs.unlink(path.join(__dirname, '..', oldItem.image), (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    }

    const updatedFoodItem = await FoodItem.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedFoodItem) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    res.status(200).json({
      ...updatedFoodItem.toObject(),
      image: `${req.protocol}://${req.get('host')}/${updatedFoodItem.image}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating food item' });
  }
};

exports.deleteFoodItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await FoodItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    if (deletedItem.image) {
      fs.unlink(path.join(__dirname, '..', deletedItem.image), (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting food item' });
  }
};

