const User = require("../models/User");
const config = require("../config/default");
const { asyncHandler } = require("../middleware/errorHandler");
const { ApiError } = require("../middleware/errorHandler");

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, location } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User with this email already exists", 400);
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    location,
  });

  await user.save();

  // Generate JWT token
  const token = user.generateAuthToken();

  // Update last login
  await user.updateLastLogin();

  res.status(201).json({
    success: true,
    message: config.messages.success.userRegistered,
    data: {
      user: user.getProfile(),
      token,
    },
  });
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email and include password for comparison
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(config.messages.error.invalidCredentials, 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError("Account is deactivated. Please contact support.", 401);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(config.messages.error.invalidCredentials, 401);
  }

  // Generate JWT token
  const token = user.generateAuthToken();

  // Update last login
  await user.updateLastLogin();

  res.json({
    success: true,
    message: config.messages.success.userLoggedIn,
    data: {
      user: user.getProfile(),
      token,
    },
  });
});

/**
 * Logout user (client-side token removal)
 * @route POST /api/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is typically handled client-side
  // by removing the token from storage. However, we can log the logout event.

  res.json({
    success: true,
    message: config.messages.success.userLoggedOut,
    data: {
      loggedOutAt: new Date(),
    },
  });
});

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(config.messages.error.userNotFound, 404);
  }

  res.json({
    success: true,
    message: "Profile retrieved successfully",
    data: {
      user: user.getProfile(),
    },
  });
});

/**
 * Update user profile
 * @route PUT /api/auth/update-profile
 * @access Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, location } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(config.messages.error.userNotFound, 404);
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError("Email is already in use", 400);
    }
    user.email = email;
  }

  // Update other fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (location) user.location = location;

  await user.save();

  res.json({
    success: true,
    message: config.messages.success.profileUpdated,
    data: {
      user: user.getProfile(),
    },
  });
});

/**
 * Change user password
 * @route PUT /api/auth/change-password
 * @access Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password for comparison
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(config.messages.error.userNotFound, 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new ApiError("Current password is incorrect", 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: config.messages.success.passwordChanged,
    data: {
      updatedAt: user.updatedAt,
    },
  });
});

/**
 * Refresh JWT token
 * @route POST /api/auth/refresh
 * @access Private
 */
const refreshToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(config.messages.error.userNotFound, 404);
  }

  if (!user.isActive) {
    throw new ApiError("Account is deactivated", 401);
  }

  // Generate new token
  const token = user.generateAuthToken();

  res.json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      token,
      user: user.getProfile(),
    },
  });
});

/**
 * Delete user account
 * @route DELETE /api/auth/delete-account
 * @access Private
 */
const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(config.messages.error.userNotFound, 404);
  }

  // Soft delete - deactivate account
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: "Account deleted successfully",
    data: {
      deletedAt: new Date(),
    },
  });
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  deleteAccount,
};
