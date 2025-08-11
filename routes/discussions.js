const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const { authenticateToken } = require('../middleware/auth');
const { validateDiscussion } = require('../middleware/validation');

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/discussions
 * @desc    Get all discussions
 * @access  Private
 */
router.get('/', discussionController.getDiscussions);

/**
 * @route   POST /api/discussions
 * @desc    Create new discussion
 * @access  Private
 */
router.post('/', validateDiscussion, discussionController.createDiscussion);

/**
 * @route   GET /api/discussions/search
 * @desc    Search discussions
 * @access  Private
 */
router.get('/search', discussionController.searchDiscussions);

/**
 * @route   GET /api/discussions/popular
 * @desc    Get popular discussions
 * @access  Private
 */
router.get('/popular', discussionController.getPopularDiscussions);

/**
 * @route   GET /api/discussions/:id
 * @desc    Get specific discussion with replies
 * @access  Private
 */
router.get('/:id', discussionController.getDiscussion);

/**
 * @route   PUT /api/discussions/:id
 * @desc    Update discussion
 * @access  Private
 */
router.put('/:id', validateDiscussion, discussionController.updateDiscussion);

/**
 * @route   DELETE /api/discussions/:id
 * @desc    Delete discussion
 * @access  Private
 */
router.delete('/:id', discussionController.deleteDiscussion);

/**
 * @route   POST /api/discussions/:id/like
 * @desc    Like/unlike discussion
 * @access  Private
 */
router.post('/:id/like', discussionController.toggleLike);

/**
 * @route   POST /api/discussions/:id/replies
 * @desc    Add reply to discussion
 * @access  Private
 */
router.post('/:id/replies', discussionController.addReply);

/**
 * @route   POST /api/discussions/:id/replies/:replyId/solution
 * @desc    Mark reply as solution
 * @access  Private
 */
router.post('/:id/replies/:replyId/solution', discussionController.markReplyAsSolution);

module.exports = router; 