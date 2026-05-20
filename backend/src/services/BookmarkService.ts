import { BookmarkRepository } from '../repositories/BookmarkRepository';

const bookmarkRepository = new BookmarkRepository();

export class BookmarkService {
  async saveJob(userId: string, jobId: string, jobTitle: string, companyName: string) {
    // Check if job is already bookmarked
    const existing = await bookmarkRepository.getBookmarkByJobId(userId, jobId);
    if (existing) {
      throw new Error('Job is already bookmarked');
    }

    return bookmarkRepository.createBookmark({ userId, jobId, jobTitle, companyName });
  }

  async unsaveJob(userId: string, jobId: string) {
    const result = await bookmarkRepository.deleteBookmark(userId, jobId);
    if (result.count === 0) {
      throw new Error('Bookmark not found');
    }
    return result;
  }

  async getSavedJobs(userId: string) {
    return bookmarkRepository.getBookmarksByUser(userId);
  }

  async isJobSaved(userId: string, jobId: string) {
    const bookmark = await bookmarkRepository.getBookmarkByJobId(userId, jobId);
    return !!bookmark;
  }
}
