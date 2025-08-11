const { asyncHandler } = require('../middleware/errorHandler');
const { generateMockData } = require('../utils/helpers');
const config = require('../config/default');

/**
 * Get nearby pharmacies/healthcare locations
 * @route GET /api/locations
 * @access Private
 */
const getLocations = asyncHandler(async (req, res) => {
  const { type, search, page = 1, limit = 10 } = req.query;

  // Boilerplate implementation - return empty array with success message
  res.json({
    success: true,
    message: 'Locations retrieved successfully',
    data: {
      locations: [],
      total: 0,
      pagination: {
        currentPage: parseInt(page),
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: parseInt(limit),
        hasNextPage: false,
        hasPrevPage: false,
      },
      filters: {
        type,
        search,
      },
    },
  });
});

/**
 * Add new location
 * @route POST /api/locations
 * @access Private
 */
const createLocation = asyncHandler(async (req, res) => {
  const { name, type, address, phone, email, website, services, insurance } = req.body;

  // Boilerplate implementation - return success message with mock data
  const mockLocation = {
    id: 'location_1',
    name: name || 'Sample Pharmacy',
    type: type || 'pharmacy',
    address: address || {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'United States',
    },
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    phone: phone || '555-123-4567',
    email: email || 'info@samplepharmacy.com',
    website: website || 'https://samplepharmacy.com',
    services: services || ['Prescription filling', 'Consultation'],
    insurance: insurance || ['Blue Cross', 'Aetna'],
    rating: 4.5,
    reviewCount: 25,
    isFavorite: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  res.status(201).json({
    success: true,
    message: config.messages.success.locationCreated,
    data: {
      location: mockLocation,
    },
  });
});

/**
 * Get locations near user's coordinates
 * @route GET /api/locations/nearby
 * @access Private
 */
const getNearbyLocations = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 10, type } = req.query; // radius in km

  // Boilerplate implementation - return mock nearby locations
  const mockNearbyLocations = generateMockData('location', 5).map(location => ({
    ...location,
    distance: Math.floor(Math.random() * radius * 10) / 10, // Random distance within radius
    coordinates: {
      latitude: parseFloat(lat) + (Math.random() - 0.5) * 0.1,
      longitude: parseFloat(lng) + (Math.random() - 0.5) * 0.1,
    },
  }));

  // Sort by distance
  mockNearbyLocations.sort((a, b) => a.distance - b.distance);

  res.json({
    success: true,
    message: 'Nearby locations retrieved successfully',
    data: {
      locations: mockNearbyLocations,
      searchCenter: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius: parseFloat(radius),
      total: mockNearbyLocations.length,
    },
  });
});

/**
 * Get location by ID
 * @route GET /api/locations/:id
 * @access Private
 */
const getLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Boilerplate implementation - return mock location data
  const mockLocation = {
    id: id,
    name: 'Sample Pharmacy',
    type: 'pharmacy',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'United States',
    },
    fullAddress: '123 Main St, Anytown, CA 12345, United States',
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    phone: '555-123-4567',
    email: 'info@samplepharmacy.com',
    website: 'https://samplepharmacy.com',
    hours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '', close: '', closed: true },
    },
    services: ['Prescription filling', 'Consultation', 'Vaccinations', 'Health screenings'],
    insurance: ['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealth'],
    rating: 4.5,
    reviewCount: 25,
    isFavorite: false,
    notes: 'Great pharmacy with friendly staff',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  res.json({
    success: true,
    message: 'Location retrieved successfully',
    data: {
      location: mockLocation,
    },
  });
});

/**
 * Update location
 * @route PUT /api/locations/:id
 * @access Private
 */
const updateLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, type, address, phone, email, website, services, insurance, notes } = req.body;

  // Boilerplate implementation - return success message
  res.json({
    success: true,
    message: 'Location updated successfully',
    data: {
      location: {
        id: id,
        name: name || 'Updated Pharmacy',
        type: type || 'pharmacy',
        address: address || {
          street: '456 Oak St',
          city: 'Newtown',
          state: 'CA',
          zipCode: '54321',
          country: 'United States',
        },
        phone: phone || '555-987-6543',
        email: email || 'info@updatedpharmacy.com',
        website: website || 'https://updatedpharmacy.com',
        services: services || ['Updated services'],
        insurance: insurance || ['Updated insurance'],
        notes: notes || 'Updated notes',
        updatedAt: new Date(),
      },
    },
  });
});

/**
 * Delete location
 * @route DELETE /api/locations/:id
 * @access Private
 */
const deleteLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Boilerplate implementation - return success message
  res.json({
    success: true,
    message: 'Location deleted successfully',
    data: {
      deletedId: id,
      deletedAt: new Date(),
    },
  });
});

/**
 * Toggle favorite status
 * @route POST /api/locations/:id/favorite
 * @access Private
 */
const toggleFavorite = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Boilerplate implementation - return success message
  res.json({
    success: true,
    message: 'Location favorite status toggled successfully',
    data: {
      locationId: id,
      isFavorite: true,
    },
  });
});

/**
 * Add review/rating
 * @route POST /api/locations/:id/review
 * @access Private
 */
const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  // Boilerplate implementation - return success message
  const mockReview = {
    id: 'review_1',
    locationId: id,
    userId: 'user_1',
    rating: rating || 5,
    comment: comment || 'Great service!',
    createdAt: new Date(),
  };

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: {
      review: mockReview,
      updatedRating: 4.6,
      updatedReviewCount: 26,
    },
  });
});

/**
 * Search locations
 * @route GET /api/locations/search
 * @access Private
 */
const searchLocations = asyncHandler(async (req, res) => {
  const { q, type, city, state, services, insurance } = req.query;

  // Boilerplate implementation - return mock search results
  const mockResults = generateMockData('location', 5);

  res.json({
    success: true,
    message: 'Location search completed successfully',
    data: {
      locations: mockResults,
      total: mockResults.length,
      query: { q, type, city, state, services, insurance },
    },
  });
});

/**
 * Get favorite locations
 * @route GET /api/locations/favorites
 * @access Private
 */
const getFavoriteLocations = asyncHandler(async (req, res) => {
  // Boilerplate implementation - return mock favorite locations
  const mockFavorites = generateMockData('location', 3).map(location => ({
    ...location,
    isFavorite: true,
  }));

  res.json({
    success: true,
    message: 'Favorite locations retrieved successfully',
    data: {
      locations: mockFavorites,
      total: mockFavorites.length,
    },
  });
});

module.exports = {
  getLocations,
  createLocation,
  getNearbyLocations,
  getLocation,
  updateLocation,
  deleteLocation,
  toggleFavorite,
  addReview,
  searchLocations,
  getFavoriteLocations,
}; 