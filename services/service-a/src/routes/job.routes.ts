import express from 'express';
import { getJobStatus, submitJob } from '../controllers/job.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = express.Router();

router.post('/submit', validateRequest, submitJob);
router.get('/status/:id', getJobStatus);
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'service-a' });
});

export default router;
