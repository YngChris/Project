const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticateToken } = require('../middleware/auth');
const { validateLocation } = require('../middleware/validation');

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/locations
 * @desc    Get nearby pharmacies/healthcare locations
 * @access  Private
 */
router.get('/', locationController.getLocations);

/**
 * @route   POST /api/locations
 * @desc    Add new location
 * @access  Private
 */
router.post('/', validateLocation, locationController.createLocation);

/**
 * @route   GET /api/locations/nearby
 * @desc    Get locations near user's coordinates
 * @access  Private
 */
router.get('/nearby', locationController.getNearbyLocations);

/**
 * @route   GET /api/locations/search
 * @desc    Search locations
 * @access  Private
 */
router.get('/search', locationController.searchLocations);

/**
 * @route   GET /api/locations/favorites
 * @desc    Get favorite locations
 * @access  Private
 */
router.get('/favorites', locationController.getFavoriteLocations);

/**
 * @route   GET /api/locations/:id
 * @desc    Get location by ID
 * @access  Private
 */
router.get('/:id', locationController.getLocation);

/**
 * @route   PUT /api/locations/:id
 * @desc    Update location
 * @access  Private
 */
router.put('/:id', validateLocation, locationController.updateLocation);

/**
 * @route   DELETE /api/locations/:id
 * @desc    Delete location
 * @access  Private
 */
router.delete('/:id', locationController.deleteLocation);

/**
 * @route   POST /api/locations/:id/favorite
 * @desc    Toggle favorite status
 * @access  Private
 */
router.post('/:id/favorite', locationController.toggleFavorite);

/**
 * @route   POST /api/locations/:id/review
 * @desc    Add review/rating
 * @access  Private
 */
router.post('/:id/review', locationController.addReview);

module.exports = router; 