import { prisma } from '../config/prisma';
import { CreateResumeInput } from '../validators/resume.schema';

export class ResumeService {
  async createResume(userId: string, data: CreateResumeInput) {
    const { experience, skills, title, ...header } = data;

    return prisma.resume.create({
      data: {
        userId,
        title: title ?? 'Untitled Resume',
        ...header,
        skills: skills ?? [],
        experiences: experience
          ? {
              create: {
                company: experience.company,
                role: experience.role,
                description: experience.description,
                startDate: new Date(experience.startDate),
                endDate: experience.endDate ? new Date(experience.endDate) : null,
              },
            }
          : undefined,
      },
      include: {
        experiences: true,
        educations: true,
        projects: true,
      },
    });
  }

  async getResumeById(userId: string, resumeId: string) {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
        projects: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    return resume;
  }
}
