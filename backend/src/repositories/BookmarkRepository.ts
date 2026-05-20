import { prisma } from '../config/prisma';

export class BookmarkRepository {
  async createBookmark(data: { userId: string; jobId: string; jobTitle: string; companyName: string }) {
    return prisma.bookmark.create({
      data,
    });
  }

  async deleteBookmark(userId: string, jobId: string) {
    return prisma.bookmark.deleteMany({
      where: { userId, jobId },
    });
  }

  async getBookmarksByUser(userId: string) {
    return prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookmarkByJobId(userId: string, jobId: string) {
    return prisma.bookmark.findFirst({
      where: { userId, jobId },
    });
  }
}
