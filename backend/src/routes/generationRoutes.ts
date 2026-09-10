import { Router } from 'express';
import { generate, getGenerations, deleteGeneration } from '../controllers/generationController';
import { auth } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(auth);

router.post('/', generate);
router.get('/', getGenerations);
router.delete('/:id', deleteGeneration);

export default router;