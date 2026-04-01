import { Worker } from 'bullmq';
import { connection } from '../config/connection.js';
import { logger, AppError } from '@shared/utils';
import { jobProcessed, jobErrors, jobProcessingTime } from '../metrics/metrics.js';

// CPU heavy Task: Fibonacci calculation
function fib(n: number): number {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// worker will listen to queue job
export const worker = new Worker(
  'jobs',
  async (job) => {
    const end = jobProcessingTime.startTimer(); // start timer for processing time
    try {
      logger.info({
        msg: 'Processing job',
        jobId: job.id,
        number: job.data.number,
      });

      const { number } = job.data;
      if (typeof number !== 'number' || number < 1 || number > 45) {
        throw new AppError('Invalid input: number must be in 1 to 45 ', 400);
      }

      const result = fib(number);

      jobProcessed.inc(); // incrementing the counter for the jobs which are processed

      logger.info({
        msg: 'Job completed',
        jobId: job.id,
        result,
      });

      return result;
    } catch (err: unknown) {
      jobErrors.inc();
      let errorMessage = 'Unknown error';
      let statusCode = 500;

      if (err instanceof AppError) {
        errorMessage = err.message;
        statusCode = err.statusCode;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      logger.error({
        msg: 'Job failed',
        jobId: job.id,
        error: errorMessage,
        statusCode,
      });

      // rethrow so BullMQ marks job as failed
      throw new Error(errorMessage);
    } finally {
      end(); // stop timer
    }
  },

  {
    connection, // Redis connection
    concurrency: 5, // run upto 5 jobs parallel
  }
);
