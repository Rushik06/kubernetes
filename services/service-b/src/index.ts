import { logger } from '@shared/utils';
import { worker } from './worker/worker.js';
import dotenv from 'dotenv';
import express from 'express';
import metricsRoutes from './routes/metrics.routes.js';

// Load env variables
dotenv.config();

logger.info('Service B worker started');

// Express app
const app = express();

// use routes
app.use('/', metricsRoutes);

const PORT = process.env.METRICS_PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Metrics running on port ${PORT}`);
});

// Debug events from worker
worker.on('completed', (job) => {
  logger.info(`job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  logger.error(`job ${job?.id} failed with error: ${err.message}`);
});
