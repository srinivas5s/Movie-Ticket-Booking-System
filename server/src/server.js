import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`[Server] Antigravity API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      console.log(`[Server] Health check available at: http://localhost:${env.PORT}/api/v1/health`);
    });

    // Graceful shutdown handlers
    const shutdown = () => {
      console.log('[Server] Gracefully shutting down...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[Server] Critical startup error:', error);
    process.exit(1);
  }
};

startServer();
