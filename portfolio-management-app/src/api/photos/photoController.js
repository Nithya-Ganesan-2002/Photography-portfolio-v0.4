const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// In-memory storage for photos (replace with proper database in production)
let photos = [];

// PUBLIC_INTERFACE
/**
 * Add a photo to a collection with tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addPhoto = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { title, description, tags = [] } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No photo file provided' });
    }

    const newPhoto = {
      id: uuidv4(),
      title: title || req.file.originalname,
      description,
      tags: Array.isArray(tags) ? tags : [],
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      collectionId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    photos.push(newPhoto);
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Error adding photo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUBLIC_INTERFACE
/**
 * Update photo details including tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { title, description, tags } = req.body;
    const userId = req.user.id;

    const photoIndex = photos.findIndex(
      photo => photo.id === photoId && photo.userId === userId
    );

    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const updatedPhoto = {
      ...photos[photoIndex],
      title: title || photos[photoIndex].title,
      description: description || photos[photoIndex].description,
      tags: tags || photos[photoIndex].tags,
      updatedAt: new Date().toISOString()
    };

    photos[photoIndex] = updatedPhoto;
    res.json(updatedPhoto);
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUBLIC_INTERFACE
/**
 * Delete a photo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    const photoIndex = photos.findIndex(
      photo => photo.id === photoId && photo.userId === userId
    );

    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete the actual file
    await fs.unlink(photos[photoIndex].filePath);

    // Remove from memory storage
    photos = photos.filter((_, index) => index !== photoIndex);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUBLIC_INTERFACE
/**
 * Get photos by collection ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPhotosByCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const userId = req.user.id;

    const collectionPhotos = photos.filter(
      photo => photo.collectionId === collectionId && photo.userId === userId
    );
    res.json(collectionPhotos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUBLIC_INTERFACE
/**
 * Search photos by tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const searchPhotosByTags = async (req, res) => {
  try {
    const { tags } = req.query;
    const userId = req.user.id;

    if (!tags) {
      return res.status(400).json({ error: 'Tags are required for search' });
    }

    const searchTags = Array.isArray(tags) ? tags : [tags];
    const matchingPhotos = photos.filter(photo => 
      photo.userId === userId && 
      photo.tags.some(tag => searchTags.includes(tag))
    );

    res.json(matchingPhotos);
  } catch (error) {
    console.error('Error searching photos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addPhoto,
  updatePhoto,
  deletePhoto,
  getPhotosByCollection,
  searchPhotosByTags
};