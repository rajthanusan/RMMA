const Image = require('../models/Image');
const { cloudinary } = require('../config/cloudinary');  

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching images' });
  }
};

exports.addImage = async (req, res) => {
  const { alt, category } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    
    const result = await cloudinary.uploader.upload(file.path);

    const newImage = new Image({
      alt,
      category,
      filename: result.secure_url, 
    });

    await newImage.save();
    res.status(201).json({ image: newImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding image' });
  }
};

exports.updateImage = async (req, res) => {
  const { id } = req.params;
  const { alt, category } = req.body;
  const file = req.file;

  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    image.alt = alt || image.alt;
    image.category = category || image.category;

    if (file) {
      
      const result = await cloudinary.uploader.upload(file.path);

      
      const oldImageUrl = image.filename;
      const publicId = oldImageUrl.split('/').pop().split('.')[0];  

      
      await cloudinary.uploader.destroy(publicId);

      
      image.filename = result.secure_url;
    }

    await image.save();
    res.status(200).json({ image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating image' });
  }
};

exports.deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    
    const publicId = image.filename.split('/').pop().split('.')[0];

    
    await cloudinary.uploader.destroy(publicId);

    
    await image.deleteOne();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting image' });
  }
};
