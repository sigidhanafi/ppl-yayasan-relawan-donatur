import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; // helper getServerSession(authOptions)
import { prisma } from '@/lib/prisma';

function badRequest(message) {
  return NextResponse.json({ message }, { status: 400 });
}
function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401 });
}
function conflict(message) {
  return NextResponse.json({ message }, { status: 409 });
}
function notFound(message) {
  return NextResponse.json({ message }, { status: 404 });
}

export async function POST(req, ctx) {
  try {
    // --- params ---
    const { id } = await ctx.params; // Next.js App Router: params should be awaited
    const activityId = Number(id);
    if (!Number.isInteger(activityId) || activityId <= 0) {
      return badRequest('ID aktivitas tidak valid.');
    }

    // --- session ---
    const session = await getSession();
    if (!session?.user?.email) {
      return unauthorized('Silakan login terlebih dahulu.');
    }

    // --- payload ---
    const body = await req.json().catch(() => null);
    if (!body) return badRequest('Payload tidak valid.');

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const notes = String(body.notes || '');
    const agree = !!body.agree;

    if (!name || !email || !phone) {
      return badRequest('Nama, email, dan nomor HP wajib diisi.');
    }
    if (!agree) {
      return badRequest('Kamu harus menyetujui ketentuan relawan.');
    }
    // (opsional) pastikan email form == email session
    if (email.toLowerCase() !== session.user.email.toLowerCase()) {
      return badRequest('Email tidak sesuai dengan akun yang login.');
    }

    // --- user dari DB ---
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true },
    });
    if (!dbUser) {
      // Seharusnya sudah dibuat oleh PrismaAdapter saat login
      return unauthorized('Akun tidak ditemukan.');
    }

    // (opsional) update nama user kalau kosong
    if (!dbUser.name && name) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { name },
      });
    }

    // --- get activity & kuota ---
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: {
        id: true,
        // slots: true, // pastikan field ini ada; sesuaikan bila beda nama
        // (opsional) tanggal berakhir untuk cegah daftar setelah selesai:
        // endAt: true,
        _count: { select: { volunteers: true } },
      },
    });
    if (!activity) {
      return notFound('Aktivitas tidak ditemukan.');
    }

    // (opsional) tolak jika kegiatan sudah lewat
    // if (activity.endAt && new Date(activity.endAt) < new Date()) {
    //   return conflict('Kegiatan sudah selesai.');
    // }

    // cek kuota
    // if (typeof activity.slots === 'number') {
    //   const used = activity._count.volunteers;
    //   if (used >= activity.slots) {
    //     return conflict('Kuota relawan sudah penuh.');
    //   }
    // }

    // --- create volunteer activity ---
    // NB: Anda punya constraint @@unique([userId, activityId]) → handle P2002
    try {
      await prisma.volunteerActivity.create({
        data: {
          userId: dbUser.id,
          activityId: activity.id,
          status: 'PENDING', // VerificationStatus enum
          // appliedAt: default now()
        },
      });
    } catch (e) {
      // Prisma duplicate key
      if (e?.code === 'P2002') {
        return conflict('Kamu sudah terdaftar pada aktivitas ini.');
      }
      throw e;
    }

    // (opsional) simpan detail tambahan di tabel lain bila disediakan
    // await prisma.volunteerApplicationDetail.create({
    //   data: { userId: dbUser.id, activityId: activity.id, phone, notes }
    // });

    // (opsional) kirim notifikasi / email panitia di sini

    return NextResponse.json({ ok: true, message: 'Pendaftaran berhasil.' });
  } catch (err) {
    console.error('register volunteer error:', err);
    return NextResponse.json(
      { message: 'Gagal mengirim formulir.' },
      { status: 500 }
    );
  }
}
