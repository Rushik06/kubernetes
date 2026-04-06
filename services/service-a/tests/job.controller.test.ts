import { describe, it, expect, vi } from 'vitest';
import { submitJob, getJobStatus } from '../src/controllers/job.controller';
import { jobQueue } from '../src/config/queue';

// mocks

vi.mock('../src/config/queue', () => ({
  jobQueue: {
    add: vi.fn(),
    getJob: vi.fn(),
  },
}));

//Mock UUID
vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

//tests of addJob and getJobStatus
describe('Job Controller', () => {
  it('submitJob success', async () => {
    const req = { body: { number: 10 } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.mocked(jobQueue.add).mockResolvedValue({ id: 'test-uuid' } as never);
    await submitJob(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Job submitted successfully',
      jobId: 'test-uuid',
    });
  });

  it('getJobStatus - not found', async () => {
    const req = { params: { id: '123' } };
    vi.mocked(jobQueue.getJob).mockResolvedValue(undefined);
    await expect(getJobStatus(req as never, {} as never)).rejects.toThrow('Job not found');
  });
});
