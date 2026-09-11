import { Response } from 'express';
import prisma from '../config/database';
import cloudinary from '../config/cloudinary';
import { AuthRequest } from '../middleware/auth';

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772',
];

export const generate = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, style, projectId, variations = 1 } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    // Clamp variations between 1 and 4
    const count = Math.max(1, Math.min(4, Number(variations) || 1));

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Pick `count` distinct images (shuffled)
    const shuffled = [...DEMO_IMAGES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    const createdImages: any[] = [];

    // Loop and generate `count` images
    for (let i = 0; i < selected.length; i++) {
      const imageUrl = selected[i];

      // Upload to Cloudinary
      const uploadResult: any = await cloudinary.uploader.upload(imageUrl, {
        folder: `visualforge/users/${userId}/projects/${projectId}/generated`,
        public_id: `generated_${Date.now()}_${i}`,
      });

      // Create Image record
      const image = await prisma.image.create({
        data: {
          userId,
          projectId,
          type: 'GENERATED',
          originalName: `generated_${Date.now()}_${i}`,
          secureUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format || 'jpg',
          width: uploadResult.width || 800,
          height: uploadResult.height || 600,
          bytes: uploadResult.bytes || 0,
        },
      });

      // Create Review record for this image
      await prisma.review.create({
        data: {
          imageId: image.id,
          userId,
          projectId,
          status: 'PENDING',
        },
      });

      createdImages.push(image);
    }

    // Log a single activity summarizing the batch
    await prisma.activity.create({
      data: {
        userId,
        projectId,
        action: 'GENERATE',
        description: `Generated ${count} visual${count > 1 ? 's' : ''} with style: ${style || 'Studio'}`,
      },
    });

    res.status(201).json({
      success: true,
      message: `Generated ${count} image${count > 1 ? 's' : ''} successfully`,
      data: createdImages,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Generation failed',
    });
  }
};

export const getGenerations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const images = await prisma.image.findMany({
      where: { userId, type: 'GENERATED' },
      include: {
        project: { select: { name: true } },
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: images });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGeneration = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const image = await prisma.image.findFirst({
      where: { id, userId, type: 'GENERATED' },
    });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Generation not found' });
    }

    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (err) {
      // ignore Cloudinary errors
    }

    await prisma.image.delete({ where: { id } });

    res.json({ success: true, message: 'Generation deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};