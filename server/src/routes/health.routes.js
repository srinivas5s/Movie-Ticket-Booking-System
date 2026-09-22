import { Router } from 'express';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getDBStatus } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDBStatus();
  const healthData = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Movie Ticket Booking System API',
    version: '1.0.0',
    database: db,
  };

  return ApiResponse.success(res, 'Service is operational', healthData);
});

export default router;
