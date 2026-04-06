import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from '../src/routes/job.routes';

const app = express();
app.use(express.json());
app.use(router);

describe('Routes', () => {
  it('should return 200 for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'service-a' });
  });
});

it('should validate submit job request', async () => {
  const res = await request(app).post('/submit').send({ number: 'not-a-number' });
  expect(res.status).toBe(400);
});
