import cloudinary from '../config/cloudinary';
import prisma from '../config/database';

export const getImages = async (req: any, res: any) => {
  try {
    console.log('Getting images for user:', req.userId);
    
    const images = await prisma.image.findMany({
      where: { userId: req.userId },
      include: { 
        project: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Images found:', images.length);
    res.json({ success: true, data: images });
  } catch (error: any) {
    console.error('Get images error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch images' 
    });
  }
};

export const uploadImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    console.log('Uploading image for user:', req.userId);
    console.log('File:', req.file.originalname);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: `visualforge/users/${req.userId}`,
          public_id: `image_${Date.now()}`
        },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(req.file.buffer);
    });

    const image = await prisma.image.create({
      data: {
        userId: req.userId,
        projectId: req.body.projectId,
        type: req.body.type || 'PRODUCT',
        originalName: req.file.originalname,
        secureUrl: (result as any).secure_url,
        publicId: (result as any).public_id,
        format: (result as any).format,
        width: (result as any).width,
        height: (result as any).height,
        bytes: (result as any).bytes,
      }
    });

    await prisma.activity.create({
      data: {
        userId: req.userId,
        projectId: req.body.projectId,
        action: 'UPLOAD',
        description: `Uploaded image "${req.file.originalname}"`
      }
    });

    console.log('Image uploaded successfully:', image.id);
    res.status(201).json({ success: true, data: image });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to upload image' 
    });
  }
};

export const deleteImage = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const image = await prisma.image.findFirst({ 
      where: { id, userId: req.userId } 
    });
    
    if (!image) {
      return res.status(404).json({ 
        success: false, 
        message: 'Image not found' 
      });
    }

    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion failed:', cloudinaryError);
    }

    await prisma.image.delete({ where: { id } });
    
    res.json({ success: true, message: 'Image deleted' });
  } catch (error: any) {
    console.error('Delete image error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete image' 
    });
  }
}; 