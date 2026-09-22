import assert from 'node:assert';
import {
  createCitySchema,
  updateCitySchema,
} from './src/utils/validators/cityValidator.js';
import {
  calculateDistanceKm,
  SEED_CITIES,
} from './src/services/cityService.js';
import { authorize } from './src/middlewares/authMiddleware.js';
import { ApiError } from './src/utils/ApiError.js';

console.log('--- STARTING PHASE 3 CITY & GEOLOCATION TESTS ---');

// 1. Test City Validation Schemas
console.log('1. Testing City Validation Schemas...');
const validCity = createCitySchema.safeParse({
  name: 'Bhubaneswar',
  state: 'Odisha',
  isPopular: false,
  isActive: true,
  coordinates: { lat: 20.2961, lng: 85.8245 },
});
assert.strictEqual(validCity.success, true, 'Valid city payload should pass');

const invalidCity = createCitySchema.safeParse({
  name: '', // Empty name
  coordinates: { lat: 100, lng: 200 }, // Lat > 90, Lng > 180
});
assert.strictEqual(invalidCity.success, false, 'Invalid city payload should fail');
console.log('✓ City validation schemas passed.');

// 2. Test Haversine Distance & Nearest City Matching
console.log('2. Testing Haversine Distance & Nearest City Algorithm...');
// Mumbai coords: 19.076, 72.8777
const distSame = calculateDistanceKm(19.076, 72.8777, 19.076, 72.8777);
assert.strictEqual(distSame, 0, 'Distance to same coordinate should be 0');

// Test nearest detection logic with SEED_CITIES
function findNearest(lat, lng) {
  let nearest = null;
  let min = Infinity;
  for (const c of SEED_CITIES) {
    const d = calculateDistanceKm(lat, lng, c.coordinates.lat, c.coordinates.lng);
    if (d < min) {
      min = d;
      nearest = c;
    }
  }
  return { nearest, distanceKm: Math.round(min * 10) / 10 };
}

// Test A: User at Gurgaon (28.4595, 77.0266) -> should match Delhi NCR
const testDelhi = findNearest(28.4595, 77.0266);
assert.strictEqual(testDelhi.nearest.name, 'Delhi NCR');
console.log(`✓ Gurgaon matched to ${testDelhi.nearest.name} (${testDelhi.distanceKm} km).`);

// Test B: User in Navi Mumbai (19.0330, 73.0297) -> should match Mumbai
const testMumbai = findNearest(19.0330, 73.0297);
assert.strictEqual(testMumbai.nearest.name, 'Mumbai');
console.log(`✓ Navi Mumbai matched to ${testMumbai.nearest.name} (${testMumbai.distanceKm} km).`);

// Test C: User in Cuttack (20.4625, 85.8828) -> should match Bhubaneswar
const testBhubaneswar = findNearest(20.4625, 85.8828);
assert.strictEqual(testBhubaneswar.nearest.name, 'Bhubaneswar');
console.log(`✓ Cuttack matched to ${testBhubaneswar.nearest.name} (${testBhubaneswar.distanceKm} km).`);

// 3. Test RBAC protection on Admin City routes
console.log('3. Testing RBAC on Admin City Mutation Endpoints...');
const adminOnlyGuard = authorize('ADMIN');

// Standard user attempt -> 403 Forbidden
let errorReceived = null;
const userReq = { user: { id: 'usr_normal', role: 'USER' } };
adminOnlyGuard(userReq, {}, (err) => { errorReceived = err; });
assert.strictEqual(errorReceived instanceof ApiError, true);
assert.strictEqual(errorReceived.statusCode, 403, 'Normal user must be rejected with 403');
console.log('✓ Normal user correctly blocked from modifying cities (403 Forbidden).');

// Admin user attempt -> authorized
errorReceived = null;
let adminPassed = false;
const adminReq = { user: { id: 'usr_admin', role: 'ADMIN' } };
adminOnlyGuard(adminReq, {}, (err) => {
  if (err) errorReceived = err;
  adminPassed = true;
});
assert.strictEqual(errorReceived, null);
assert.strictEqual(adminPassed, true);
console.log('✓ Admin user authorized for city operations.');

console.log('\n--- ALL PHASE 3 TESTS COMPLETED SUCCESSFULLY! ---');
