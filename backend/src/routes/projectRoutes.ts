import { Router } from 'express';
import { getProjects, createProject, getProject, updateProject, deleteProject } from '../controllers/projectController';
import { auth } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(auth);

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;