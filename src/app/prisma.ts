import { Prisma, PrismaClient } from '~/persistence/generated/client';

export const prisma = new PrismaClient();

export { Prisma };
