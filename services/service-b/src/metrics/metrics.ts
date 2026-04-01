import client from 'prom-client';

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

const jobProcessed = new client.Counter({
  name: 'jobs_processed_total',
  help: 'Total number of jobs processed',
  registers: [register],
});

const jobProcessingTime = new client.Histogram({
  name: 'job_processing_time_seconds',
  help: 'Time taken to process a job in seconds',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

const jobErrors = new client.Counter({
  name: 'job_errors_total',
  help: 'Total number of job errors',
  registers: [register],
});

export { jobProcessed, jobProcessingTime, jobErrors };
