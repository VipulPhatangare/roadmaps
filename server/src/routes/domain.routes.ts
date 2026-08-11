import { Router } from 'express';
import multer from 'multer';
import {
  importCSV,
  getAllDomains,
  getDomainById,
  triggerGeneration,
  getGenerationStatus,
  generateAllBatch,
  publishDomain,
} from '../controllers/domain.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/import', authMiddleware, requireRole('ADMIN'), upload.single('file'), importCSV);
router.get('/', getAllDomains);
router.post('/batch-generate', authMiddleware, requireRole('ADMIN'), generateAllBatch);
router.get('/:id', getDomainById);
router.post('/:id/generate', authMiddleware, requireRole('ADMIN', 'EDITOR'), triggerGeneration);
router.get('/:id/generation-status', authMiddleware, getGenerationStatus);
router.post('/:id/publish', authMiddleware, requireRole('ADMIN'), publishDomain);

export default router;
