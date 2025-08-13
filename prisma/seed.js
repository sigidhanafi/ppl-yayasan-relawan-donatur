import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@yayasan.local';
  const adminPass = 'admin123';

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const hashed = await bcrypt.hash(adminPass, 10);
    await prisma.user.create({
      data: {
        name: 'Administrator',
        email: adminEmail,
        password: hashed,
        role: UserRole.ADMIN,
      },
    });
    console.log(`Admin dibuat: ${adminEmail} / ${adminPass}`);
  } else {
    console.log(`Admin ${adminEmail} sudah ada, skip.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
