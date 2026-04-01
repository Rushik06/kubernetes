import express from 'express';
import { getJobStatus, submitJob } from '../controllers/job.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = express.Router();

//SUBMIT JOB QUEUE
router.post('/submit', validateRequest, submitJob);

//GET JOB STATUS
router.get('/status/:id', getJobStatus);

//CHECK HEALTH
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'service-a' });
});

export default router;
