const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/reports
 * @desc    Get user's medication reports
 * @access  Private
 */
router.get("/", reportController.getReports);

/**
 * @route   POST /api/reports
 * @desc    Create new report
 * @access  Private
 */
router.post("/", reportController.createReport);

/**
 * @route   GET /api/reports/summary
 * @desc    Get adherence summary
 * @access  Private
 */
router.get("/summary", reportController.getAdherenceSummary);

/**
 * @route   GET /api/reports/chart
 * @desc    Get medication adherence chart data
 * @access  Private
 */
router.get("/chart", reportController.getChartData);

/**
 * @route   GET /api/reports/export
 * @desc    Export reports
 * @access  Private
 */
router.get("/export", reportController.exportReports);

/**
 * @route   GET /api/reports/:id
 * @desc    Get report by ID
 * @access  Private
 */
router.get("/:id", reportController.getReport);

/**
 * @route   PUT /api/reports/:id
 * @desc    Update report
 * @access  Private
 */
router.put("/:id", reportController.updateReport);

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete report
 * @access  Private
 */
router.delete("/:id", reportController.deleteReport);

module.exports = router;
