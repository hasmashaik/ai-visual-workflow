import { Router } from 'express';
import { uploadImage, deleteImage, getImages } from '../controllers/imageController';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(auth);

router.get('/', getImages);
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/:id', deleteImage);

export default router;