import { Worker } from 'bullmq';
import { connection } from '../config/connection';
import { logger } from '@shared/utils';

//CPU heavy Task: Fibonacci calculation
function fib(n: number): number {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

//worker will listen to queue job
export const worker = new Worker(
  'jobs',
  async (job) => {
    logger.info({
      msg: 'Processing job',
      jobId: job.id,
      number: job.data.number,
    });

    const { number } = job.data;

    const result = fib(number);

    logger.info({
      msg: 'Job completed',
      jobId: job.id,
      result,
    });
    return result;
  },
  {
    connection, //this is talking about redis connection
    concurrency: 5, //run upto 5 jobs parllel
  }
);
