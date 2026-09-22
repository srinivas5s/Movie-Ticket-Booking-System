import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { CityService } from '../services/cityService.js';

export const getCities = asyncHandler(async (req, res) => {
  const cities = await CityService.getAllCities({
    isPopular: req.query.isPopular,
    search: req.query.search,
    includeInactive: req.query.includeInactive === 'true',
  });

  return ApiResponse.success(res, 'Cities retrieved successfully', cities);
});

export const detectCity = asyncHandler(async (req, res) => {
  const result = await CityService.detectNearestCity(req.query.lat, req.query.lng);
  return ApiResponse.success(res, 'Location matched successfully', result);
});

export const createCity = asyncHandler(async (req, res) => {
  const city = await CityService.createCity(req.body);
  return ApiResponse.created(res, 'City created successfully', city);
});

export const updateCity = asyncHandler(async (req, res) => {
  const city = await CityService.updateCity(req.params.id, req.body);
  return ApiResponse.success(res, 'City updated successfully', city);
});

export const deleteCity = asyncHandler(async (req, res) => {
  const city = await CityService.toggleCityStatus(req.params.id);
  return ApiResponse.success(res, `City ${city.isActive ? 'activated' : 'deactivated'} successfully`, city);
});
