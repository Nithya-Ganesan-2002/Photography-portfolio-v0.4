const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// In-memory storage for collections (replace with proper database in production)
let collections = [];
let photos = []; // In-memory storage for photos
let photos = []; // In-memory storage for photos

// PUBLIC_INTERFACE
/**
 * Create a new collection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCollection = async (req, res) => {
  try {
    const { title, description, privacy = 'private' } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newCollection = {
      id: uuidv4(),
      title,
      description,
      privacy,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    collections.push(newCollection);
    res.status(201).json(newCollection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUBLIC_INTERFACE
/**
 * Get all collections for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserCollections = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const userCollections = collections.filter(col => col.userId === userId);
    res.json(userCollections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUBLIC_INTERFACE
/**
 * Update a collection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, privacy } = req.body;
    const userId = req.user.id;

    const collectionIndex = collections.findIndex(col => col.id === id && col.userId === userId);

    if (collectionIndex === -1) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const updatedCollection = {
      ...collections[collectionIndex],
      title: title || collections[collectionIndex].title,
      description: description || collections[collectionIndex].description,
      privacy: privacy || collections[collectionIndex].privacy,
      updatedAt: new Date().toISOString()
    };

    collections[collectionIndex] = updatedCollection;
    res.json(updatedCollection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUBLIC_INTERFACE
/**
 * Delete a collection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const collectionIndex = collections.findIndex(col => col.id === id && col.userId === userId);

    if (collectionIndex === -1) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    collections = collections.filter((_, index) => index !== collectionIndex);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUBLIC_INTERFACE
/**
 * Get collection details including photos
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCollectionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const collection = collections.find(col => col.id === id && col.userId === userId);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Get photos for this collection
    const collectionPhotos = photos.filter(photo => photo.collectionId === id);
    const collectionWithPhotos = {
      ...collection,
      photos: collectionPhotos
    };

    res.json(collectionWithPhotos);
  } catch (error) {
    console.error('Error getting collection details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createCollection,
  getUserCollections,
  updateCollection,
  deleteCollection,
  getCollectionDetails
};
