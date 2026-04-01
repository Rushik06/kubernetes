import { logger } from '@shared/utils';
import { worker } from './worker/worker';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

logger.info('Service B worker started');

//Debug event from the worker
worker.on('completed', (job) => {
  logger.info(`job ${job.id} completed sucessfully`);
});

worker.on('failed', (job, err) => {
  logger.error(`job ${job?.id} failed with error: ${err.message}`);
});
