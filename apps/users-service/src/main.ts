import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'users-service',
    timestamp: new Date().toISOString(),
  });
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Users service listening at http://localhost:${port}`);
});

server.on('error', console.error);
