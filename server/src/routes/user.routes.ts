import { Router } from 'express';
import {
  startRoadmap,
  getUserRoadmaps,
  getProgress,
  completeNode,
  completeProject,
  switchPath,
  getRecommendation,
  getApiKey,
  generateApiKey,
} from '../controllers/user.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/api-key', optionalAuthMiddleware, getApiKey);
router.post('/api-key/generate', optionalAuthMiddleware, generateApiKey);

router.use(authMiddleware);
router.post('/roadmaps/:id/start', startRoadmap);
router.get('/roadmaps', getUserRoadmaps);
router.get('/roadmaps/:id/progress', getProgress);
router.post('/roadmaps/:id/node/:nodeId/complete', completeNode);
router.post('/roadmaps/:id/project/:projectId/complete', completeProject);
router.post('/roadmaps/:id/path', switchPath);
router.get('/recommendation', getRecommendation);

export default router;
