import express from 'express';
import instituteRouter from './institute';
import { checkFeatureFlag } from '../middleware/feature-flag.middleware';

const apiRoutes = express.Router();

// Feature-protected routes
apiRoutes.use('/institutes', checkFeatureFlag('instituteManagement'), instituteRouter);

// Public routes (no feature flag required)
apiRoutes.get('/healthCheck', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

export { apiRoutes };
