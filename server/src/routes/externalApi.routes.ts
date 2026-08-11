import { Router } from 'express';
import { apiKeyAuth } from '../middleware/apiKey.middleware';
import {
  getExternalRoadmapsBasic,
  getExternalRoadmapById,
} from '../controllers/externalApi.controller';

const router = Router();

// Apply API Key authentication to all external API routes
router.use(apiKeyAuth);

// GET /api/v1/external/roadmaps -> Basic info list (IDs & Names)
router.get('/', getExternalRoadmapsBasic);

// GET /api/v1/external/roadmaps/:id -> Full roadmap data by ID or slug
router.get('/:id', getExternalRoadmapById);

export default router;
