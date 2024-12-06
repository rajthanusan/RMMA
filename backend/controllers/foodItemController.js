const FoodItem = require('../models/FoodItem');

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
    const imagePath = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
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

