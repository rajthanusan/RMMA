const About = require('../models/About');


const getAboutData = async (req, res) => {
  try {
    const aboutData = await About.findOne(); 
    if (!aboutData) {
      return res.status(404).json({ message: 'About Us data not found' });
    }
    res.status(200).json({ data: aboutData });
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateAboutData = async (req, res) => {
  const { description, teamDescription } = req.body;

  try {
    
    const aboutData = await About.findOne();
    if (aboutData) {
      
      aboutData.description = description || aboutData.description;
      aboutData.teamDescription = teamDescription || aboutData.teamDescription;
      await aboutData.save();
      return res.status(200).json({ message: 'About Us data updated successfully', data: aboutData });
    } else {
      
      const newAboutData = new About({ description, teamDescription });
      await newAboutData.save();
      return res.status(201).json({ message: 'About Us data created successfully', data: newAboutData });
    }
  } catch (error) {
    console.error('Error updating About Us data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getAboutData, updateAboutData };
