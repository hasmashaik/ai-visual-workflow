import { Response } from 'express';
import prisma from '../config/database';
import cloudinary from '../config/cloudinary';
import { AuthRequest } from '../middleware/auth';

export const generate = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, style, projectId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const demoImages = [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
    ];

    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];

    const uploadResult: any = await cloudinary.uploader.upload(randomImage, {
      folder: `visualforge/users/${userId}/projects/${projectId}/generated`,
      public_id: `generated_${Date.now()}`,
    });

    // 1. Create image record
    const image = await prisma.image.create({
      data: {
        userId,
        projectId,
        type: 'GENERATED',
        originalName: `generated_${Date.now()}`,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format || 'jpg',
        width: uploadResult.width || 800,
        height: uploadResult.height || 600,
        bytes: uploadResult.bytes || 0,
      }
    });

    console.log(' Image created:', image.id);

    // 2.  Create review record automatically
    const review = await prisma.review.create({
      data: {
        imageId: image.id,
        userId,
        projectId,
        status: 'PENDING',
      }
    });

    console.log(' Review created:', review.id);

    // 3.  Create activity record
    const activity = await prisma.activity.create({
      data: {
        userId,
        projectId,
        action: 'GENERATE',
        description: `Generated visual with style: ${style || 'Studio'}`,
      }
    });

    console.log(' Activity created:', activity.id);

    res.status(201).json({
      success: true,
      message: 'Generation completed successfully',
      data: { image, review, activity }
    });

  } catch (error: any) {
    console.error(' Generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Generation failed'
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
      orderBy: { createdAt: 'desc' }
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
    } catch (cloudErr) {
      console.error('Cloudinary delete failed:', cloudErr);
    }

    await prisma.image.delete({ where: { id } });

    res.json({ success: true, message: 'Generation deleted successfully' });
  } catch (error: any) {
    console.error('Delete generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};