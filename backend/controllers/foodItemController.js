const FoodItem = require('../models/FoodItem');

exports.getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food items', error: error.message });
  }
};
exports.addFoodItem = async (req, res) => {
  try {
    const { name, rating, category, price, description } = req.body;

    if (!name || !rating || !category) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    
    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path;
    }

    const newFoodItem = new FoodItem({
      name,
      rating,
      category,
      price: price || 0,  
      description: description || '',  
      image: imageUrl,
    });

    await newFoodItem.save();

    res.status(201).json(newFoodItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding food item', error: error.message });
  }
};


exports.updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, category, price, description } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (rating) updateData.rating = rating;
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = price;  
    if (description !== undefined) updateData.description = description;  

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedFoodItem = await FoodItem.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedFoodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item updated successfully', data: updatedFoodItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating food item', error: error.message });
  }
};

exports.toggleFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const foodItem = await FoodItem.findById(id);
    
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    foodItem.isActive = !foodItem.isActive;
    await foodItem.save();

    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling food item', error: error.message });
  }
};

exports.deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFoodItem = await FoodItem.findByIdAndDelete(id);
    
    if (!deletedFoodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting food item', error: error.message });
  }
};

