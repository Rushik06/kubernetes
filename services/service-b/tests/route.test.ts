import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from '../src/routes/metrics.routes';

const app = express();
app.use(router);

describe('metrics route', () => {
  it('should return metrics', async () => {
    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
  });

  it('should include some metrics data', async () => {
    const res = await request(app).get('/metrics');

    expect(res.text).toContain('process_cpu_seconds_total');
  });
});
