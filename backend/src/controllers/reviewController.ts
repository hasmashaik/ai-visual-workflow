import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getReviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const where: any = { userId };
    if (status && status !== 'all') {
      where.status = (status as string).toUpperCase();
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        image: {
          select: {
            id: true,
            secureUrl: true,
            originalName: true,
            type: true,
            width: true,
            height: true,
          }
        },
        project: {
          select: { id: true, name: true }
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    const allReviews = await prisma.review.findMany({ where: { userId } });
    const counts = {
      total: allReviews.length,
      pending: allReviews.filter(r => r.status === 'PENDING').length,
      approved: allReviews.filter(r => r.status === 'APPROVED').length,
      rejected: allReviews.filter(r => r.status === 'REJECTED').length,
      revision: allReviews.filter(r => r.status === 'REVISION_REQUESTED').length,
    };

    res.json({ success: true, data: reviews, counts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const existing: any = await prisma.review.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const projectId = existing.projectId || null;

    const review = await prisma.review.update({
      where: { id },
      data: {
        status: status || existing.status,
        comment: comment !== undefined ? comment : existing.comment,
      },
      include: {
        image: { select: { secureUrl: true, originalName: true } },
        project: { select: { name: true } },
      }
    });

    await prisma.activity.create({
      data: {
        userId,
        projectId,
        action: 'REVIEW',
        description: `${
          status === 'APPROVED' ? 'Approved' :
          status === 'REJECTED' ? 'Rejected' :
          status === 'REVISION_REQUESTED' ? 'Requested revision for' :
          'Updated review for'
        } image "${review.image.originalName}"`,
      }
    });

    res.json({
      success: true,
      data: review,
      message: `Review ${status ? status.toLowerCase() : 'updated'}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { imageId, projectId } = req.body;
    const userId = req.userId;

    if (!userId || !imageId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const image = await prisma.image.findFirst({ where: { id: imageId, userId } });
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const review = await prisma.review.create({
      data: { imageId, projectId, userId, status: 'PENDING' }
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};