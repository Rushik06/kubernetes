// src/controllers/job.controller.ts

import { Request, Response } from 'express';
import { jobQueue } from '../config/queue.js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { AppError } from '@shared/utils';
import { JobStatusResponse } from '../types/job.types.js';

// Submit Job
export async function submitJob(req: Request, res: Response) {
  const { number } = req.body;

  // Validate input
  if (typeof number !== 'number') {
    throw new AppError('Number must be a valid number', 400);
  }

  const jobId = uuidv4();

  const job = await jobQueue.add('fibonacci-job', { number }, { jobId });

  logger.info({
    msg: 'Job submitted',
    jobId: job.id,
    number,
  });

  res.status(202).json({
    message: 'Job submitted successfully',
    jobId: job.id,
  });
}

// Get Job Status
export async function getJobStatus(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  const job = await jobQueue.getJob(id);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const state = await job.getState();

  const response: JobStatusResponse = {
    jobId: job.id!,
    status: state,
  };

  if (state === 'completed') {
    response.result = job.returnvalue as number;
  }

  if (state === 'failed') {
    response.error = job.failedReason;
  }

  res.json(response);
}
