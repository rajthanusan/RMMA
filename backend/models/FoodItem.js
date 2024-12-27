const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Appetizers', 'Main Courses', 'Desserts', 'Drinks', 'Snacks'],
  },
  image: { type: String, required: true },
  price: { type: Number, default: 0 },  
  description: { type: String, default: '' },  
  isActive: { type: Boolean, default: true },
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
