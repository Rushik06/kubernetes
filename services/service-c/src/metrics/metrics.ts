import client from 'prom-client';

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

//total jobs submitted
const totalJobsSubmitted = new client.Counter({
  name: 'total_jobs_submitted',
  help: 'Total number of jobs submitted',
  registers: [register],
});

//total jobs completed
const totalJobsCompleted = new client.Gauge({
  name: 'total_jobs_completed',
  help: 'Total number of jobs completed',
  registers: [register],
});

//Queue length gauge
const queueLength = new client.Gauge({
  name: 'queue_length',
  help: 'Current length of the job queue',
  registers: [register],
});

export { totalJobsSubmitted, totalJobsCompleted, queueLength };
