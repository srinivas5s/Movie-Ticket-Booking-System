import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiResponse } from './ApiResponse.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE || '7d',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  };

  // Sanitize user object
  const sanitizedUser = {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    defaultCity: user.defaultCity || 'mumbai',
    createdAt: user.createdAt,
  };

  return res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json(
      new ApiResponse(
        statusCode,
        {
          token,
          user: sanitizedUser,
        },
        message
      )
    );
};
