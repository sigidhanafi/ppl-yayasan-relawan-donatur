// app/auth/route-decider/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; // helper getServerSession(authOptions)
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const session = await getSession();
  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/auth', base));
  }

  // Ambil user + relasi owner
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      organization: { select: { id: true, name: true } },
    },
  });

  // Secara teori, kalau pakai PrismaAdapter, user sudah dibuat.
  // Kalau belum (adapter custom?), arahkan ke onboarding.
  if (!dbUser) {
    return NextResponse.redirect(new URL('/auth/onboarding', base));
  }

  // Heuristik "user baru": dibuat sangat dekat dengan waktu sekarang (mis. <= 60 detik)
  const createdAt = new Date(dbUser.createdAt).getTime();
  const now = Date.now();
  const isNewlyCreated = Math.abs(now - createdAt) <= 60 * 1000;

  if (isNewlyCreated) {
    // Baru dibuat oleh adapter saat sign-in pertama → onboarding
    return NextResponse.redirect(new URL('/auth/onboarding', base));
  }

  // DEBUG
  // const safe = dbUser
  //   ? {
  //       id: dbUser.id,
  //       email: dbUser.email,
  //       name: dbUser.name,
  //       role: dbUser.role,
  //       createdAt: dbUser.createdAt?.toISOString?.() ?? dbUser.createdAt,
  //       updatedAt: dbUser.updatedAt?.toISOString?.() ?? dbUser.updatedAt,
  //       organization: dbUser.organization,
  //     }
  //   : null;

  // return NextResponse.json({
  //   sessionUserEmail: session.user.email,
  //   dbUser: safe,
  //   note: 'Mode debug aktif karena ?debug=1. Jangan aktifkan di production.',
  // });

  const isOwner = dbUser.organization;
  if (isOwner) {
    return NextResponse.redirect(new URL('/dashboard', base));
  }

  // User lama biasa → ke beranda
  return NextResponse.redirect(new URL('/', base));
}
