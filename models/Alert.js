const mongoose = require('mongoose');

/**
 * Alert Schema
 */
const alertSchema = new mongoose.Schema({
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
  time: {
    type: String,
    required: [true, 'Alert time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    default: 'daily',
  },
  daysOfWeek: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastTriggered: {
    type: Date,
    default: null,
  },
  nextTrigger: {
    type: Date,
    default: null,
  },
  message: {
    type: String,
    trim: true,
    maxlength: [200, 'Message cannot be more than 200 characters'],
    default: 'Time to take your medication!',
  },
  sound: {
    type: String,
    default: 'default',
  },
  vibration: {
    type: Boolean,
    default: true,
  },
  snoozeTime: {
    type: Number,
    default: 15, // minutes
    min: [1, 'Snooze time must be at least 1 minute'],
    max: [60, 'Snooze time cannot exceed 60 minutes'],
  },
  maxSnoozes: {
    type: Number,
    default: 3,
    min: [0, 'Max snoozes cannot be negative'],
    max: [10, 'Max snoozes cannot exceed 10'],
  },
  currentSnoozes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
alertSchema.index({ user: 1, isActive: 1 });
alertSchema.index({ user: 1, medication: 1 });
alertSchema.index({ nextTrigger: 1, isActive: 1 });
alertSchema.index({ lastTriggered: -1 });

/**
 * Virtual for alert status
 */
alertSchema.virtual('status').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.currentSnoozes >= this.maxSnoozes) return 'overdue';
  return 'active';
});

/**
 * Calculate next trigger time
 */
alertSchema.methods.calculateNextTrigger = function() {
  const now = new Date();
  const [hours, minutes] = this.time.split(':').map(Number);
  
  let nextTrigger = new Date();
  nextTrigger.setHours(hours, minutes, 0, 0);
  
  // If time has passed today, set for tomorrow
  if (nextTrigger <= now) {
    nextTrigger.setDate(nextTrigger.getDate() + 1);
  }
  
  this.nextTrigger = nextTrigger;
  return this.save();
};

/**
 * Mark alert as triggered
 */
alertSchema.methods.markTriggered = function() {
  this.lastTriggered = new Date();
  this.currentSnoozes = 0;
  this.calculateNextTrigger();
  return this.save();
};

/**
 * Snooze alert
 */
alertSchema.methods.snooze = function() {
  if (this.currentSnoozes >= this.maxSnoozes) {
    throw new Error('Maximum snoozes reached');
  }
  
  this.currentSnoozes += 1;
  const snoozeTime = new Date();
  snoozeTime.setMinutes(snoozeTime.getMinutes() + this.snoozeTime);
  this.nextTrigger = snoozeTime;
  
  return this.save();
};

/**
 * Get alert summary
 * @returns {Object} Alert summary object
 */
alertSchema.methods.getSummary = function() {
  return {
    id: this._id,
    medication: this.medication,
    time: this.time,
    frequency: this.frequency,
    isActive: this.isActive,
    status: this.status,
    lastTriggered: this.lastTriggered,
    nextTrigger: this.nextTrigger,
    message: this.message,
    currentSnoozes: this.currentSnoozes,
    maxSnoozes: this.maxSnoozes,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Alert', alertSchema); 