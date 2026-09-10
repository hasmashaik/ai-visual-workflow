import prisma from '../config/database';

async function backfillReviews() {
  const imagesWithoutReviews = await prisma.image.findMany({
    where: {
      type: 'GENERATED',
      reviews: {
        none: {}
      }
    },
    select: {
      id: true,
      userId: true,
      projectId: true,
      originalName: true,
    }
  });

  if (imagesWithoutReviews.length === 0) {
    return;
  }

  for (const image of imagesWithoutReviews) {
    await prisma.review.create({
      data: {
        imageId: image.id,
        userId: image.userId,
        projectId: image.projectId,
        status: 'PENDING',
      }
    });
  }
}

backfillReviews()
  .then(() => prisma.$disconnect())
  .catch(() => prisma.$disconnect());