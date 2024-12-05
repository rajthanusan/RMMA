const FoodItem = require('../models/FoodItem');


exports.getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching food items' });
  }
};


exports.addFoodItem = async (req, res) => {
  const { name, rating, category, image } = req.body;

  if (!name || !rating || !category || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newFoodItem = new FoodItem({
      name,
      rating,
      category,
      image,
    });

    await newFoodItem.save();
    res.status(201).json(newFoodItem);
  } catch (error) {
    res.status(500).json({ error: 'Error adding food item' });
  }
};
