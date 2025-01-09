const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../auth/authMiddleware');
const {
  createCollection,
  getUserCollections,
  updateCollection,
  deleteCollection
} = require('./collectionController');

// All collection routes require authentication
router.use(authenticateToken);

// Create new collection
router.post('/', createCollection);

// Get user collections
router.get('/', getUserCollections);

// Update collection
router.put('/:id', updateCollection);

// Delete collection
router.delete('/:id', deleteCollection);

module.exports = router;