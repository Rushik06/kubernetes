import { logger } from '@shared/utils';
import { worker } from './worker/worker.js';
import dotenv from 'dotenv';
import express from 'express';
import { register } from './metrics/metrics.js';

// Load env variables
dotenv.config();

logger.info('Service B worker started');

// Metrics server setup
const app = express();

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.METRICS_PORT || 3001;

app.listen(PORT, () => {
  logger.info(` Metrics running on port ${PORT}`);
});

// Debug events from the worker
worker.on('completed', (job) => {
  logger.info(`job ${job.id} completed sucessfully`);
});

worker.on('failed', (job, err) => {
  logger.error(`job ${job?.id} failed with error: ${err.message}`);
});
