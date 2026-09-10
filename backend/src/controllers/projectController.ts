import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    console.log('Getting projects for user:', userId);
    
    const projects = await prisma.project.findMany({ 
      where: { userId },
      include: { 
        _count: { 
          select: { 
            images: true
          } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Projects found:', projects.length);
    res.json({ success: true, data: projects });
  } catch (error: any) {
    console.error('Get projects error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch projects' 
    });
  }
};

export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    console.log('Getting project:', id, 'for user:', userId);

    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        images: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            images: true,
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    const projectWithProducts = {
      ...project,
      products: [],
      imageAssets: project.images || [],
    };

    res.json({ success: true, data: projectWithProducts });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch project' 
    });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project name is required' 
      });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const project = await prisma.project.create({
      data: { 
        name, 
        description, 
        category: category || 'Other', 
        userId 
      }
    });
    
    await prisma.activity.create({
      data: { 
        userId, 
        projectId: project.id, 
        action: 'CREATE', 
        description: `Created project "${name}"` 
      }
    });
    
    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create project' 
    });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, category, status } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const project = await prisma.project.findFirst({
      where: { id, userId }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { 
        name: name || project.name,
        description: description !== undefined ? description : project.description,
        category: category || project.category,
        status: status || project.status
      }
    });

    await prisma.activity.create({
      data: {
        userId,
        projectId: id,
        action: 'UPDATE',
        description: `Updated project "${updated.name}"`
      }
    });

    res.json({ 
      success: true, 
      message: 'Project updated successfully',
      data: updated 
    });
  } catch (error: any) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update project' 
    });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const project = await prisma.project.findFirst({ 
      where: { id, userId } 
    });
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    await prisma.project.delete({ where: { id } });
    
    res.json({ success: true, message: 'Project deleted' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete project' 
    });
  }
};