const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/medicationController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/medications
 * @desc    Get all medications for current user
 * @access  Private
 */
router.get("/", medicationController.getMedications);

/**
 * @route   POST /api/medications
 * @desc    Add new medication
 * @access  Private
 */
router.post("/", medicationController.createMedication);

/**
 * @route   GET /api/medications/search
 * @desc    Search medications
 * @access  Private
 */
router.get("/search", medicationController.searchMedications);

/**
 * @route   PUT /api/medications/bulk
 * @desc    Bulk update medications
 * @access  Private
 */
router.put("/bulk", medicationController.bulkUpdateMedications);

/**
 * @route   GET /api/medications/:id
 * @desc    Get specific medication by ID
 * @access  Private
 */
router.get("/:id", medicationController.getMedication);

/**
 * @route   PUT /api/medications/:id
 * @desc    Update medication
 * @access  Private
 */
router.put("/:id", medicationController.updateMedication);

/**
 * @route   DELETE /api/medications/:id
 * @desc    Delete medication
 * @access  Private
 */
router.delete("/:id", medicationController.deleteMedication);

/**
 * @route   GET /api/medications/:id/stats
 * @desc    Get medication statistics
 * @access  Private
 */
router.get("/:id/stats", medicationController.getMedicationStats);

module.exports = router;
