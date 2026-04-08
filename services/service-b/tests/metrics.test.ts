import { describe, it, expect } from 'vitest';
import { register, jobProcessed, jobProcessingTime, jobErrors } from '../src/metrics/metrics';

describe('Metrics', () => {
  it('should increment jobProcessed counter', async () => {
    jobProcessed.inc();

    const metrics = await register.metrics();
    expect(metrics).toContain('jobs_processed_total 1');
  });

  it('should record job processing time', async () => {
    jobProcessingTime.observe(0.5);

    const metrics = await register.metrics();
    expect(metrics).toContain('job_processing_time_seconds_count 1');
  });

  it('should increment jobErrors counter', async () => {
    jobErrors.inc();

    const metrics = await register.metrics();
    expect(metrics).toContain('job_errors_total 1');
  });
});
