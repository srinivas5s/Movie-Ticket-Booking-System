import { City } from '../models/City.js';
import { ApiError } from '../utils/ApiError.js';

export const SEED_CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', isPopular: true, isActive: true, coordinates: { lat: 19.076, lng: 72.8777 } },
  { name: 'Delhi NCR', state: 'Delhi', isPopular: true, isActive: true, coordinates: { lat: 28.6139, lng: 77.209 } },
  { name: 'Bengaluru', state: 'Karnataka', isPopular: true, isActive: true, coordinates: { lat: 12.9716, lng: 77.5946 } },
  { name: 'Hyderabad', state: 'Telangana', isPopular: true, isActive: true, coordinates: { lat: 17.385, lng: 78.4867 } },
  { name: 'Chennai', state: 'Tamil Nadu', isPopular: true, isActive: true, coordinates: { lat: 13.0827, lng: 80.2707 } },
  { name: 'Kolkata', state: 'West Bengal', isPopular: true, isActive: true, coordinates: { lat: 22.5726, lng: 88.3639 } },
  { name: 'Pune', state: 'Maharashtra', isPopular: true, isActive: true, coordinates: { lat: 18.5204, lng: 73.8567 } },
  { name: 'Ahmedabad', state: 'Gujarat', isPopular: true, isActive: true, coordinates: { lat: 23.0225, lng: 72.5714 } },
  { name: 'Chandigarh', state: 'Punjab', isPopular: false, isActive: true, coordinates: { lat: 30.7333, lng: 76.7794 } },
  { name: 'Jaipur', state: 'Rajasthan', isPopular: false, isActive: true, coordinates: { lat: 26.9124, lng: 75.7873 } },
  { name: 'Kochi', state: 'Kerala', isPopular: false, isActive: true, coordinates: { lat: 9.9312, lng: 76.2673 } },
  { name: 'Bhubaneswar', state: 'Odisha', isPopular: false, isActive: true, coordinates: { lat: 20.2961, lng: 85.8245 } },
];

/**
 * Haversine great-circle distance in kilometers
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class CityService {
  /**
   * Automatically seed initial cities if the database collection is empty
   */
  static async seedIfEmpty() {
    try {
      const count = await City.countDocuments();
      if (count === 0) {
        await City.insertMany(SEED_CITIES);
        console.log('[CityService] Default cinema hub cities seeded successfully.');
      }
    } catch (err) {
      console.warn('[CityService] Automatic seeding notice:', err.message);
    }
  }

  /**
   * Fetch all managed cities with optional filters
   */
  static async getAllCities({ isPopular, search, includeInactive } = {}) {
    await this.seedIfEmpty();

    const query = {};

    if (!includeInactive) {
      query.isActive = true;
    }

    if (isPopular === 'true' || isPopular === true) {
      query.isPopular = true;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { state: regex }];
    }

    return City.find(query).sort({ isPopular: -1, name: 1 });
  }

  /**
   * Reverse lookup the closest managed city given user coordinates
   */
  static async detectNearestCity(lat, lng) {
    await this.seedIfEmpty();

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const activeCities = await City.find({ isActive: true });

    if (!activeCities.length) {
      throw ApiError.notFound('No cinema cities are currently active.');
    }

    // If coordinates are invalid, fall back to default popular city (Mumbai)
    if (isNaN(userLat) || isNaN(userLng)) {
      const defaultCity = activeCities.find((c) => c.name.toLowerCase() === 'mumbai') || activeCities[0];
      return {
        city: defaultCity,
        distanceKm: null,
        isFallback: true,
      };
    }

    // Find nearest city using Haversine calculation
    let nearest = null;
    let minDistance = Infinity;

    for (const city of activeCities) {
      if (city.coordinates?.lat && city.coordinates?.lng) {
        const dist = calculateDistanceKm(userLat, userLng, city.coordinates.lat, city.coordinates.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = city;
        }
      }
    }

    if (!nearest) {
      nearest = activeCities[0];
    }

    return {
      city: nearest,
      distanceKm: Math.round(minDistance * 10) / 10,
      isFallback: false,
    };
  }

  /**
   * Admin: Add a new city
   */
  static async createCity(data) {
    const existing = await City.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') },
    });

    if (existing) {
      throw ApiError.conflict(`City with name '${data.name}' already exists.`);
    }

    return City.create({
      name: data.name.trim(),
      state: data.state?.trim() || '',
      isPopular: data.isPopular || false,
      isActive: data.isActive !== undefined ? data.isActive : true,
      coordinates: data.coordinates || { lat: 0, lng: 0 },
    });
  }

  /**
   * Admin: Update city details
   */
  static async updateCity(id, data) {
    if (data.name) {
      const existing = await City.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') },
      });
      if (existing) {
        throw ApiError.conflict(`Another city with name '${data.name}' already exists.`);
      }
    }

    const city = await City.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!city) {
      throw ApiError.notFound('City not found.');
    }

    return city;
  }

  /**
   * Admin: Toggle active status / soft delete
   */
  static async toggleCityStatus(id) {
    const city = await City.findById(id);
    if (!city) {
      throw ApiError.notFound('City not found.');
    }

    city.isActive = !city.isActive;
    await city.save();
    return city;
  }
}
