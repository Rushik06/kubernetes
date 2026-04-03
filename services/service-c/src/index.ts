import dotenv from 'dotenv';
import express from 'express';
import { Queue } from 'bullmq';
import { connection } from './config/connection.js';
import { logger } from '@shared/utils';
import {
  register,
  totalJobsSubmitted,
  totalJobsCompleted,
  queueLength,
} from './metrics/metrics.js';

// Load env variables
dotenv.config();

const app = express();

// connect to same queue as service-a and service-b
const queue = new Queue('jobs', { connection });

// stats endpoint
app.get('/stats', async (_req, res) => {
  const counts = await queue.getJobCounts();
  //job counts
  const totalJobs = counts.completed + counts.failed + counts.waiting + counts.active;

  // completed and failed jobs
  const completedJobs = counts.completed;
  const failedJobs = counts.failed;

  //Queue length
  const currentQueueLength = counts.waiting + counts.active;

  // update metrics
  totalJobsSubmitted.inc(totalJobs);
  totalJobsCompleted.set(completedJobs);
  queueLength.set(currentQueueLength);

  res.json({
    totalJobs,
    completedJobs,
    failedJobs,
    queueLength: currentQueueLength,
  });
});

// metrics endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  logger.info(`Service C running on port ${PORT}`);
});
