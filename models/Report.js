const mongoose = require('mongoose');

/**
 * Report Schema
 */
const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true,
  },
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: [true, 'Medication is required'],
    index: true,
  },
  alert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert',
    index: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  taken: {
    type: Boolean,
    required: [true, 'Taken status is required'],
    default: false,
  },
  takenAt: {
    type: Date,
    default: null,
  },
  skipped: {
    type: Boolean,
    default: false,
  },
  skippedReason: {
    type: String,
    trim: true,
    maxlength: [200, 'Skip reason cannot be more than 200 characters'],
  },
  sideEffects: [{
    type: String,
    trim: true,
    maxlength: [200, 'Side effect cannot be more than 200 characters'],
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'terrible'],
  },
  symptoms: [{
    type: String,
    trim: true,
    maxlength: [200, 'Symptom cannot be more than 200 characters'],
  }],
  dosageTaken: {
    type: String,
    trim: true,
    maxlength: [50, 'Dosage taken cannot be more than 50 characters'],
  },
  timeTaken: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
reportSchema.index({ user: 1, date: -1 });
reportSchema.index({ user: 1, medication: 1, date: -1 });
reportSchema.index({ user: 1, taken: 1, date: -1 });
reportSchema.index({ date: -1 });

/**
 * Virtual for adherence percentage
 */
reportSchema.virtual('adherencePercentage').get(function() {
  // This would typically be calculated across multiple reports
  return this.taken ? 100 : 0;
});

/**
 * Mark medication as taken
 */
reportSchema.methods.markTaken = function(dosageTaken = null, timeTaken = null, notes = null) {
  this.taken = true;
  this.takenAt = new Date();
  this.skipped = false;
  
  if (dosageTaken) this.dosageTaken = dosageTaken;
  if (timeTaken) this.timeTaken = timeTaken;
  if (notes) this.notes = notes;
  
  return this.save();
};

/**
 * Mark medication as skipped
 */
reportSchema.methods.markSkipped = function(reason = null) {
  this.taken = false;
  this.skipped = true;
  this.skippedReason = reason;
  
  return this.save();
};

/**
 * Add side effect
 */
reportSchema.methods.addSideEffect = function(sideEffect) {
  if (!this.sideEffects.includes(sideEffect)) {
    this.sideEffects.push(sideEffect);
  }
  return this.save();
};

/**
 * Add symptom
 */
reportSchema.methods.addSymptom = function(symptom) {
  if (!this.symptoms.includes(symptom)) {
    this.symptoms.push(symptom);
  }
  return this.save();
};

/**
 * Get report summary
 * @returns {Object} Report summary object
 */
reportSchema.methods.getSummary = function() {
  return {
    id: this._id,
    medication: this.medication,
    date: this.date,
    taken: this.taken,
    takenAt: this.takenAt,
    skipped: this.skipped,
    skippedReason: this.skippedReason,
    dosageTaken: this.dosageTaken,
    timeTaken: this.timeTaken,
    mood: this.mood,
    sideEffects: this.sideEffects,
    symptoms: this.symptoms,
    notes: this.notes,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Report', reportSchema); 