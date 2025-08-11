const mongoose = require('mongoose');

/**
 * Reply Schema (embedded in Discussion)
 */
const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  content: {
    type: String,
    required: [true, 'Reply content is required'],
    trim: true,
    maxlength: [2000, 'Reply content cannot be more than 2000 characters'],
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isSolution: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

/**
 * Discussion Schema
 */
const discussionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Discussion title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Discussion content is required'],
    trim: true,
    maxlength: [5000, 'Content cannot be more than 5000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['general', 'medication', 'side-effects', 'lifestyle', 'support', 'tips', 'questions'],
    default: 'general',
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot be more than 50 characters'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isSticky: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  replies: [replySchema],
  lastReply: {
    type: Date,
    default: null,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    index: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
discussionSchema.index({ user: 1, createdAt: -1 });
discussionSchema.index({ category: 1, createdAt: -1 });
discussionSchema.index({ isActive: 1, isSticky: -1, createdAt: -1 });
discussionSchema.index({ title: 'text', content: 'text' });
discussionSchema.index({ tags: 1 });
discussionSchema.index({ lastReply: -1 });

/**
 * Virtual for reply count
 */
discussionSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

/**
 * Virtual for like count
 */
discussionSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

/**
 * Virtual for discussion status
 */
discussionSchema.virtual('status').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.isLocked) return 'locked';
  if (this.isSticky) return 'sticky';
  return 'active';
});

/**
 * Increment view count
 */
discussionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

/**
 * Toggle like for a user
 */
discussionSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  } else {
    this.likes.push(userId);
  }
  return this.save();
};

/**
 * Add reply to discussion
 */
discussionSchema.methods.addReply = function(userId, content) {
  const reply = {
    user: userId,
    content: content,
  };
  
  this.replies.push(reply);
  this.lastReply = new Date();
  
  return this.save();
};

/**
 * Edit discussion
 */
discussionSchema.methods.edit = function(title, content) {
  this.title = title;
  this.content = content;
  this.isEdited = true;
  this.editedAt = new Date();
  
  return this.save();
};

/**
 * Mark reply as solution
 */
discussionSchema.methods.markReplyAsSolution = function(replyId) {
  // Remove solution from all other replies
  this.replies.forEach(reply => {
    reply.isSolution = false;
  });
  
  // Mark the specified reply as solution
  const reply = this.replies.id(replyId);
  if (reply) {
    reply.isSolution = true;
  }
  
  return this.save();
};

/**
 * Get discussion summary
 * @returns {Object} Discussion summary object
 */
discussionSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    category: this.category,
    tags: this.tags,
    user: this.user,
    isActive: this.isActive,
    isSticky: this.isSticky,
    isLocked: this.isLocked,
    views: this.views,
    replyCount: this.replyCount,
    likeCount: this.likeCount,
    status: this.status,
    lastReply: this.lastReply,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Discussion', discussionSchema); 