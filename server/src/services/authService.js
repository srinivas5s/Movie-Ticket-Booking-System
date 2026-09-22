import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export class AuthService {
  static async registerUser({ name, email, password, phone, defaultCity, role }) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    // Role cannot be escalated to ADMIN by unauthenticated public registrations unless explicitly permitted
    const assignedRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone?.trim() || '',
      defaultCity: defaultCity?.trim() || 'mumbai',
      role: assignedRole,
    });

    return user;
  }

  static async loginUser({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password credentials.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password credentials.');
    }

    return user;
  }

  static async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }
    return user;
  }

  static async updateUserProfile(userId, { name, phone, defaultCity }) {
    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name.trim();
    if (phone !== undefined) updatePayload.phone = phone.trim();
    if (defaultCity !== undefined) updatePayload.defaultCity = defaultCity.trim();

    const user = await User.findByIdAndUpdate(userId, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }

    return user;
  }
}
