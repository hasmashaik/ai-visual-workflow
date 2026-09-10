import { Router } from 'express';
import { getReviews, updateReview, createReview } from '../controllers/reviewController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.get('/', getReviews);
router.post('/', createReview);
router.put('/:id', updateReview);

export default router;