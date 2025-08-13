import { prisma } from '@/lib/prisma';

function toRupiah(n) {
  if (n == null) return 0;
  return Number(n);
}

/**
 * Ambil daftar kegiatan untuk landing page.
 * Termasuk:
 * - nama organisasi & status verifikasi
 * - total donasi APPROVED
 * - jumlah relawan VERIFIED
 * - cover (dokumentasi pertama jika ada)
 */
export async function listActivitiesForLanding({ limit = 30 } = {}) {
  const activities = await prisma.activity.findMany({
    take: limit,
    orderBy: [{ date: 'desc' }],
    include: {
      organization: { select: { name: true, isVerified: true } },
      donations: {
        where: { status: 'APPROVED' },
        select: { amount: true },
      },
      volunteers: {
        where: { status: 'VERIFIED' },
        select: { id: true },
      },
      documents: { take: 1, select: { filePath: true, fileType: true } },
    },
  });

  return activities.map((a) => {
    const totalApproved = a.donations.reduce(
      (acc, d) => acc + toRupiah(d.amount),
      0
    );
    const verifiedVols = a.volunteers.length;
    const cover = a.documents[0]?.filePath
      ? `/uploads/${a.documents[0].filePath}`
      : null;

    return {
      id: a.id,
      name: a.name,
      description: a.description,
      date: a.date,
      status: a.status,
      orgName: a.organization?.name ?? '—',
      orgVerified: !!a.organization?.isVerified,
      totalApproved,
      verifiedVols,
      cover,
    };
  });
}
