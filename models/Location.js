const mongoose = require('mongoose');

/**
 * Location Schema
 */
const locationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true,
    maxlength: [200, 'Location name cannot be more than 200 characters'],
  },
  type: {
    type: String,
    required: [true, 'Location type is required'],
    enum: ['pharmacy', 'hospital', 'clinic', 'doctor-office', 'urgent-care', 'specialist', 'other'],
    default: 'pharmacy',
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [200, 'Street address cannot be more than 200 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot be more than 100 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [50, 'State cannot be more than 50 characters'],
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true,
      maxlength: [20, 'ZIP code cannot be more than 20 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [100, 'Country cannot be more than 100 characters'],
      default: 'United States',
    },
  },
  coordinates: {
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot be more than 20 characters'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
  },
  website: {
    type: String,
    trim: true,
    maxlength: [200, 'Website URL cannot be more than 200 characters'],
  },
  hours: {
    monday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    tuesday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    wednesday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    thursday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    friday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    saturday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    sunday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
  },
  services: [{
    type: String,
    trim: true,
    maxlength: [100, 'Service name cannot be more than 100 characters'],
  }],
  insurance: [{
    type: String,
    trim: true,
    maxlength: [100, 'Insurance name cannot be more than 100 characters'],
  }],
  rating: {
    type: Number,
    min: [0, 'Rating must be between 0 and 5'],
    max: [5, 'Rating must be between 0 and 5'],
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative'],
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
locationSchema.index({ user: 1, type: 1 });
locationSchema.index({ user: 1, isFavorite: 1 });
locationSchema.index({ 'address.city': 1, 'address.state': 1 });
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ name: 'text' });

/**
 * Virtual for full address
 */
locationSchema.virtual('fullAddress').get(function() {
  const { street, city, state, zipCode, country } = this.address;
  return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
});

/**
 * Virtual for distance (would be calculated when needed)
 */
locationSchema.virtual('distance').get(function() {
  // This would be calculated based on user's current location
  return null;
});

/**
 * Calculate distance from given coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {number|null} Distance in kilometers
 */
locationSchema.methods.calculateDistance = function(lat, lng) {
  if (!this.coordinates.latitude || !this.coordinates.longitude) {
    return null;
  }
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat - this.coordinates.latitude) * Math.PI / 180;
  const dLng = (lng - this.coordinates.longitude) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.coordinates.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Toggle favorite status
 */
locationSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

/**
 * Add service
 */
locationSchema.methods.addService = function(service) {
  if (!this.services.includes(service)) {
    this.services.push(service);
  }
  return this.save();
};

/**
 * Add insurance
 */
locationSchema.methods.addInsurance = function(insurance) {
  if (!this.insurance.includes(insurance)) {
    this.insurance.push(insurance);
  }
  return this.save();
};

/**
 * Update rating
 */
locationSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.rating * this.reviewCount) + newRating;
  this.reviewCount += 1;
  this.rating = totalRating / this.reviewCount;
  return this.save();
};

/**
 * Get location summary
 * @returns {Object} Location summary object
 */
locationSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    address: this.address,
    fullAddress: this.fullAddress,
    coordinates: this.coordinates,
    phone: this.phone,
    email: this.email,
    website: this.website,
    rating: this.rating,
    reviewCount: this.reviewCount,
    isFavorite: this.isFavorite,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Location', locationSchema); 