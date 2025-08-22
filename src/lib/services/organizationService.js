import { prisma } from '@/lib/prisma';

export async function createOrganization(
  userId,
  { name, address, description, licenseNumber }
) {
  const org = await prisma.organization.create({
    data: {
      name,
      address,
      description,
      licenseNumber,
      isVerified: false,
      ownerId: Number(userId),
    },
  });

  // opsional: ubah role user
  await prisma.user.update({
    where: { id: Number(userId) },
    data: { role: 'ORGANISASI' },
  });

  return org;
}
