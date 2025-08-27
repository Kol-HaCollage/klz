/**
 * Users Service API
 * This is the main entry point for the users service
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'users-service',
    timestamp: new Date().toISOString(),
  });
});

// Basic API info
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to users-service!',
    version: '1.0.0',
    endpoints: [
      'GET /health - Health check',
      'POST /api/auth/signup - User registration',
      'POST /api/auth/login - User login',
    ],
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Error:', err);

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';

    res.status(err.status || 500).json({
      error: isDevelopment ? err.message : 'Internal server error',
      ...(isDevelopment && { stack: err.stack }),
    });
  }
);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Users service listening at http://localhost:${port}`);
  console.log(`Health check available at http://localhost:${port}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Available endpoints:`);
  console.log(`   POST http://localhost:${port}/api/auth/signup`);
  console.log(`   POST http://localhost:${port}/api/auth/login`);
});

server.on('error', console.error);
