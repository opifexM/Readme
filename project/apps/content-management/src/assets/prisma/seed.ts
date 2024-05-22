import { DatabasePostStatus, DatabasePostType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const usersIds = ['author-uuid-001', 'author-uuid-002', 'author-uuid-003', 'author-uuid-004', 'author-uuid-005'];
  const postTypes = [DatabasePostType.TEXT, DatabasePostType.PHOTO, DatabasePostType.VIDEO, DatabasePostType.LINK, DatabasePostType.QUOTE];

  for (const type of postTypes) {
    for (let i = 1; i <= 5; i++) {
      const postData = {
        postType: type,
        tags: [type.toLowerCase()],
        authorId: usersIds[i % usersIds.length],
        postedAt: new Date(),
        createdAt: new Date(),
        postStatus: DatabasePostStatus.PUBLISHED,
        likeCount: 0,
        commentCount: 5,
        repostCount: 0,
      };

      const createdPost = await prisma.post.create({
        data: postData
      });

      const postId = createdPost.id;

      if (type === DatabasePostType.TEXT) {
        await prisma.textPost.create({
          data: {
            title: 'Interesting insights about ' + type,
            text: 'Details about ' + type,
            postId: postId
          }
        });
      } else if (type === DatabasePostType.PHOTO) {
        await prisma.photoPost.create({
          data: {
            url: 'https://example.com/photo' + i + '.jpg',
            postId: postId
          }
        });
      } else if (type === DatabasePostType.VIDEO) {
        await prisma.videoPost.create({
          data: {
            title: 'A deep dive into ' + type,
            url: 'https://example.com/video' + i + '.mp4',
            postId: postId
          }
        });
      } else if (type === DatabasePostType.LINK) {
        await prisma.linkPost.create({
          data: {
            url: 'https://example.com/link' + i,
            description: 'A fascinating link about ' + type,
            postId: postId
          }
        });
      } else if (type === DatabasePostType.QUOTE) {
        await prisma.quotePost.create({
          data: {
            text: 'Inspiring quote for ' + type,
            author: usersIds[i % usersIds.length],
            postId: postId
          }
        });
      }

      for (let j = 1; j <= 5; j++) {
        await prisma.comment.create({
          data: {
            text: `Comment ${j} for ${type} post #${i}`,
            postId: postId,
            authorId: usersIds[j % usersIds.length],
            createdAt: new Date(),
          }
        });
      }
    }
  }

  console.log('Database seeded successfully');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
