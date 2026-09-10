import { Router } from 'express';
import { getActivities } from '../controllers/activityController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);
router.get('/', getActivities);

export default router;