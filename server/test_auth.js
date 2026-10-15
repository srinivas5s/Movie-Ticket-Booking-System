import assert from 'node:assert';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from './src/utils/token.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from './src/utils/validators/authValidator.js';
import { ApiError } from './src/utils/ApiError.js';
import { ApiResponse } from './src/utils/ApiResponse.js';
import { authorize } from './src/middlewares/authMiddleware.js';

console.log('--- STARTING PHASE 2 AUTH & RBAC VERIFICATION ---');

// 1. Test Zod Validation Schemas
console.log('1. Testing Zod Validation Schemas...');
// Valid registration
const validReg = registerSchema.safeParse({
  name: 'John Nolan',
  email: 'john@cinemas.com',
  password: 'securepassword123',
  phone: '9876543210',
  defaultCity: 'mumbai',
});
assert.strictEqual(validReg.success, true, 'Valid registration payload should pass');

// Invalid registration (password < 6 chars)
const invalidReg = registerSchema.safeParse({
  name: 'J',
  email: 'invalid-email',
  password: '123',
});
assert.strictEqual(invalidReg.success, false, 'Invalid registration payload should fail');
const issueCount = invalidReg.error.issues ? invalidReg.error.issues.length : (invalidReg.error.errors ? invalidReg.error.errors.length : 1);
assert.strictEqual(issueCount >= 2, true, 'Should have multiple validation errors');

// Valid login
const validLogin = loginSchema.safeParse({
  email: 'john@cinemas.com',
  password: 'password123',
});
assert.strictEqual(validLogin.success, true, 'Valid login should pass');

// Invalid login
const invalidLogin = loginSchema.safeParse({
  email: '',
  password: '',
});
assert.strictEqual(invalidLogin.success, false, 'Invalid login should fail');
console.log('✓ Zod schemas validation passed.');

// 2. Test Password Hashing with bcryptjs
console.log('2. Testing Bcrypt Password Hashing & Comparison...');
const plainText = 'CinevaSecretPassword!';
const salt = bcrypt.genSaltSync(10);
const hashed = bcrypt.hashSync(plainText, salt);
assert.notStrictEqual(plainText, hashed);
assert.strictEqual(bcrypt.compareSync(plainText, hashed), true);
assert.strictEqual(bcrypt.compareSync('WrongPassword', hashed), false);
console.log('✓ Password hashing and verification passed.');

// 3. Test JWT Generation and Verification
console.log('3. Testing JWT Signing & Verification...');
const testPayload = { id: 'usr_test_12345', role: 'ADMIN' };
const token = generateToken(testPayload);
assert.strictEqual(typeof token, 'string');
assert.strictEqual(token.split('.').length, 3, 'Token should have 3 segments (header.payload.signature)');

const decoded = verifyToken(token);
assert.strictEqual(decoded.id, testPayload.id);
assert.strictEqual(decoded.role, testPayload.role);
console.log('✓ JWT token generation and decode passed.');

// 4. Test RBAC authorize middleware
console.log('4. Testing Role-Based Access Control (RBAC) Guard...');
const adminOnlyMiddleware = authorize('ADMIN');

// Test Case A: User has USER role -> should reject with 403 Forbidden
let errorCaught = null;
const mockReqUser = { user: { id: 'usr_normal', role: 'USER' } };
const mockRes = {};
const mockNext = (err) => {
  errorCaught = err;
};

adminOnlyMiddleware(mockReqUser, mockRes, mockNext);
assert.strictEqual(errorCaught instanceof ApiError, true);
assert.strictEqual(errorCaught.statusCode, 403, 'Should return 403 Forbidden for non-admin');
console.log('✓ User role correctly rejected from Admin-only resource (403).');

// Test Case B: User has ADMIN role -> should call next() without error
errorCaught = null;
let nextCalled = false;
const mockReqAdmin = { user: { id: 'usr_admin', role: 'ADMIN' } };
const mockNextAdmin = (err) => {
  if (err) errorCaught = err;
  nextCalled = true;
};

adminOnlyMiddleware(mockReqAdmin, mockRes, mockNextAdmin);
assert.strictEqual(errorCaught, null, 'Admin should not receive error');
assert.strictEqual(nextCalled, true, 'Admin should proceed to next handler');
console.log('✓ Admin role successfully authorized to proceed.');

// Test Case C: No user attached -> should reject with 401 Unauthorized
errorCaught = null;
const mockReqUnauth = { user: null };
adminOnlyMiddleware(mockReqUnauth, mockRes, (err) => { errorCaught = err; });
assert.strictEqual(errorCaught instanceof ApiError, true);
assert.strictEqual(errorCaught.statusCode, 401, 'Unauthenticated user should get 401');
console.log('✓ Unauthenticated request correctly rejected with 401.');

// 5. Test Standardized API Error & Response Wrappers
console.log('5. Testing ApiResponse & ApiError structures...');
const testResponse = new ApiResponse(200, { sample: 'data' }, 'Operation completed');
assert.strictEqual(testResponse.success, true);
assert.strictEqual(testResponse.statusCode, 200);
assert.deepStrictEqual(testResponse.data, { sample: 'data' });

const testError = ApiError.notFound('Show not found');
assert.strictEqual(testError.success, false);
assert.strictEqual(testError.statusCode, 404);
console.log('✓ Standardized response shapes verified.');

console.log('\n--- ALL PHASE 2 VERIFICATIONS PASSED SUCCESSFULLY! ---');
