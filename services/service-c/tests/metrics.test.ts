import { describe, it, expect, beforeEach } from 'vitest';
import {
  register,
  totalJobsSubmitted,
  totalJobsCompleted,
  queueLength,
} from '../src/metrics/metrics';

describe('stats metrics', () => {
  beforeEach(() => {
    register.resetMetrics();
  });

  it('increments submitted jobs', async () => {
    totalJobsSubmitted.inc();

    const res = await register.metrics();
    expect(res.includes('total_jobs_submitted 1')).toBe(true);
  });

  it('updates completed jobs and queue length', async () => {
    totalJobsCompleted.set(5);
    queueLength.set(2);

    const res = await register.metrics();
    expect(res.includes('total_jobs_completed 5')).toBe(true);
    expect(res.includes('queue_length 2')).toBe(true);
  });
});
