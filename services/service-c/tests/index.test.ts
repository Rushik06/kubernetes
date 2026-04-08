import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('bullmq', () => {
  return {
    Queue: class {
      getJobCounts = vi.fn().mockResolvedValue({
        completed: 1,
        failed: 0,
        waiting: 2,
        active: 1,
      });
    },
  };
});

import app from '../src/index';

describe('GET routes', () => {
  it('GET /stats works', async () => {
    const res = await request(app).get('/stats');

    expect(res.status).toBe(200);
    expect(res.body.totalJobs).toBeDefined();
  });

  it('GET /metrics works', async () => {
    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
  });
});
