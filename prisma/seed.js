import { PrismaClient, UserRole, ActivityStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding...');

  // --- Seed Users ---
  const usersToSeed = [
    {
      email: 'admin@yayasan.local',
      name: 'Administrator',
      role: UserRole.ADMIN,
      password: 'admin123',
    },
    {
      email: 'owner1@yayasan.local',
      name: 'Owner Organisasi 1',
      role: UserRole.ORGANISASI,
      password: 'password123',
    },
  ];

  const seededUsers = [];
  for (const user of usersToSeed) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });
      seededUsers.push(newUser);
      console.log(`✅ Pengguna dibuat: ${newUser.name} (${newUser.role})`);
    } else {
      seededUsers.push(existingUser);
      console.log(`ℹ️ Pengguna ${existingUser.name} sudah ada, skip.`);
    }
  }

  const adminUser = seededUsers.find(u => u.role === UserRole.ADMIN);
  const orgOwner = seededUsers.find(u => u.role === UserRole.ORGANISASI);
  
  if (!adminUser || !orgOwner) {
    console.error('❌ Gagal menemukan pengguna yang diperlukan.');
    process.exit(1);
  }

  // --- Seed Organizations ---
  const organizationsToSeed = [
    {
      id: 1,
      name: 'Yayasan Peduli Anak',
      address: 'Jl. Contoh No. 123',
      description: 'Yayasan yang fokus pada pendidikan dan kesejahteraan anak.',
      isVerified: true,
      ownerId: orgOwner.id,
    },
    {
      id: 2,
      name: 'Komunitas Peduli Lingkungan',
      address: 'Jl. Lingkungan Hijau No. 45',
      description: 'Komunitas yang fokus pada kebersihan dan pelestarian alam.',
      isVerified: false,
      ownerId: adminUser.id, // Contoh relasi lain
    },
  ];

  for (const org of organizationsToSeed) {
    await prisma.organization.upsert({
      where: { id: org.id },
      update: {},
      create: org,
    });
    console.log(`✅ Organisasi di-seed: ${org.name}`);
  }

  // --- Seed Activities ---
  const activitiesToSeed = [
    {
      id: 1,
      name: 'Donasi untuk Anak Yatim',
      description: 'Penggalangan dana untuk kebutuhan sekolah dan makan anak-anak di panti asuhan.',
      date: new Date('2025-11-20T10:00:00Z'),
      status: ActivityStatus.OPEN,
      organizationId: organizationsToSeed[0].id,
    },
    {
      id: 2,
      name: 'Kelas Literasi untuk Anak',
      description: 'Program literasi dasar untuk anak usia 7–10 tahun.',
      date: new Date('2025-10-25T08:00:00Z'),
      status: ActivityStatus.OPEN,
      organizationId: organizationsToSeed[0].id,
    },
  ];

  for (const activity of activitiesToSeed) {
    await prisma.activity.upsert({
      where: { id: activity.id }, // Corrected: Using the unique 'id' field
      update: {},
      create: activity,
    });
    console.log(`✅ Kegiatan di-seed: ${activity.name}`);
  }

  console.log('Proses seeding selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });