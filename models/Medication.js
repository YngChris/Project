const mongoose = require('mongoose');

/**
 * Medication Schema
 */
const medicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Medication name is required'],
    trim: true,
    maxlength: [100, 'Medication name cannot be more than 100 characters'],
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    trim: true,
    maxlength: [50, 'Dosage cannot be more than 50 characters'],
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    trim: true,
    maxlength: [100, 'Frequency cannot be more than 100 characters'],
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: [500, 'Instructions cannot be more than 500 characters'],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  prescriptionNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Prescription number cannot be more than 50 characters'],
  },
  pharmacy: {
    type: String,
    trim: true,
    maxlength: [100, 'Pharmacy name cannot be more than 100 characters'],
  },
  doctor: {
    type: String,
    trim: true,
    maxlength: [100, 'Doctor name cannot be more than 100 characters'],
  },
  sideEffects: [{
    type: String,
    trim: true,
    maxlength: [200, 'Side effect cannot be more than 200 characters'],
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
medicationSchema.index({ user: 1, isActive: 1 });
medicationSchema.index({ user: 1, createdAt: -1 });
medicationSchema.index({ name: 'text' });

/**
 * Virtual for medication duration
 */
medicationSchema.virtual('duration').get(function() {
  if (!this.startDate) return null;
  if (!this.endDate) return 'Ongoing';
  
  const duration = this.endDate - this.startDate;
  const days = Math.ceil(duration / (1000 * 60 * 60 * 24));
  return `${days} days`;
});

/**
 * Get medication summary
 * @returns {Object} Medication summary object
 */
medicationSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    dosage: this.dosage,
    frequency: this.frequency,
    isActive: this.isActive,
    startDate: this.startDate,
    endDate: this.endDate,
    duration: this.duration,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Medication', medicationSchema); 