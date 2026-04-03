import { Router } from 'express';
import { register } from '../metrics/metrics';

const router = Router();

// metrics endpoint
router.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default router;
