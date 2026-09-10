import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { limit = 50 } = req.query;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const activities = await prisma.activity.findMany({
      where: { userId },
      include: {
        project: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    res.json({ success: true, data: activities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};