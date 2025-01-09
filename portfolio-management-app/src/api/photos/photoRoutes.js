const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../auth/authMiddleware');
const {
  addPhoto,
  updatePhoto,
  deletePhoto,
  getPhotosByCollection,
  searchPhotosByTags
} = require('./photoController');

const router = express.Router();

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/photos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  }
});

// Photo management routes
router.post('/collections/:collectionId/photos', authenticateToken, upload.single('photo'), addPhoto);
router.put('/photos/:photoId', authenticateToken, updatePhoto);
router.delete('/photos/:photoId', authenticateToken, deletePhoto);
router.get('/collections/:collectionId/photos', authenticateToken, getPhotosByCollection);
router.get('/photos/search', authenticateToken, searchPhotosByTags);

module.exports = router;