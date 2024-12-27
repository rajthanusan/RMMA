const Review = require('../models/reviewModel'); 


exports.addReview = async (req, res) => {
  const { name, review, rating } = req.body;

  try {
    const newReview = new Review({
      name,
      review,
      rating,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err });
  }
};


exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews); 
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};


exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { name, review, rating } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { name, review, rating },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update review', error: err });
  }
};


exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err });
  }
};
