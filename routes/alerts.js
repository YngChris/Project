const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/alerts
 * @desc    Get all alerts for current user
 * @access  Private
 */
router.get("/", alertController.getAlerts);

/**
 * @route   POST /api/alerts
 * @desc    Create new alert
 * @access  Private
 */
router.post("/", alertController.createAlert);

/**
 * @route   GET /api/alerts/stats
 * @desc    Get alert statistics
 * @access  Private
 */
router.get("/stats", alertController.getAlertStats);

/**
 * @route   GET /api/alerts/upcoming
 * @desc    Get upcoming alerts
 * @access  Private
 */
router.get("/upcoming", alertController.getUpcomingAlerts);

/**
 * @route   PUT /api/alerts/bulk
 * @desc    Bulk update alerts
 * @access  Private
 */
router.put("/bulk", alertController.bulkUpdateAlerts);

/**
 * @route   PUT /api/alerts/:id
 * @desc    Update alert
 * @access  Private
 */
router.put("/:id", alertController.updateAlert);

/**
 * @route   DELETE /api/alerts/:id
 * @desc    Delete alert
 * @access  Private
 */
router.delete("/:id", alertController.deleteAlert);

/**
 * @route   POST /api/alerts/:id/mark-taken
 * @desc    Mark medication as taken
 * @access  Private
 */
router.post("/:id/mark-taken", alertController.markTaken);

/**
 * @route   POST /api/alerts/:id/snooze
 * @desc    Snooze alert
 * @access  Private
 */
router.post("/:id/snooze", alertController.snoozeAlert);

module.exports = router;
