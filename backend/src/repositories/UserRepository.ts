import { prisma } from '../config/prisma';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; passwordHash: string; name?: string | null }) {
    // We convert null to undefined to satisfy Prisma's strict typing if name is null
    const nameToStore = data.name === null ? undefined : data.name;
    
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: nameToStore,
      },
    });
  }
}
