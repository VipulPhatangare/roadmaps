import { Router } from 'express';
import { getRoadmaps, getRoadmapBySlug, getNodeDetail } from '../controllers/roadmap.controller';

const router = Router();
router.get('/', getRoadmaps);
router.get('/:slug', getRoadmapBySlug);
router.get('/:slug/node/:nodeId', getNodeDetail);

export default router;
