import { Router } from 'express';
import { createProduct } from '../controllers/productController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);
router.post('/projects/:projectId/products', createProduct);

export default router;