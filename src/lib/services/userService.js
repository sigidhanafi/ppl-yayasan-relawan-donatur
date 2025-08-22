import { prisma } from '@/lib/prisma';

export async function updateUserProfile(userId, { name, address }) {
  return prisma.user.update({
    where: { id: Number(userId) },
    data: { name, address },
  });
}
