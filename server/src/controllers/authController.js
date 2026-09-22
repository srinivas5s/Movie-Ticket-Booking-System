import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sendTokenResponse } from '../utils/token.js';
import { AuthService } from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const user = await AuthService.registerUser(req.body);
  return sendTokenResponse(user, 201, res, 'Account created successfully');
});

export const login = asyncHandler(async (req, res) => {
  const user = await AuthService.loginUser(req.body);
  return sendTokenResponse(user, 200, res, 'Logged in successfully');
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  return ApiResponse.success(res, 'Logged out successfully', {});
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await AuthService.getUserProfile(req.user._id);
  return ApiResponse.success(res, 'Profile retrieved successfully', user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await AuthService.updateUserProfile(req.user._id, req.body);
  return ApiResponse.success(res, 'Profile updated successfully', updatedUser);
});
