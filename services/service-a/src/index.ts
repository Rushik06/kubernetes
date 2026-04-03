import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import jobRoutes from './routes/job.routes.js';
import { errorHandler } from '@shared/utils';
import { logger } from '@shared/utils';

// Load env variables
dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// Rate limiting
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX) || 100;

const limiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: {
    error: 'Too many requests, please try again later',
  },
});

app.use(limiter);

// Parse JSON
app.use(express.json());

// HTTP request logging
app.use(morgan('dev'));

// Routes
app.use('/', jobRoutes);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Service A running on port ${PORT}`);
});
