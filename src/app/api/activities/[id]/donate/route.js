// app/api/activities/[id]/donate/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { PrismaClient, Prisma } from '@prisma/client';

export const runtime = 'nodejs';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const id = params.id; // Fix: Mengakses properti id secara langsung
    const activityId = parseInt(id, 10);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { message: 'ID kegiatan tidak valid.' },
        { status: 400 }
      );
    }

    // Perbaikan: Memastikan activityId ada di database
    const activityExists = await prisma.activity.findUnique({
      where: { id: activityId },
    });
    if (!activityExists) {
      return NextResponse.json(
        { message: 'Kegiatan tidak ditemukan.' },
        { status: 404 }
      );
    }

    const form = await req.formData();
    const name = form.get('name') || '';
    const email = form.get('email') || '';
    const phone = form.get('phone') || '';
    const amount = Number(form.get('amount') || 0);
    const method = form.get('method') || 'transfer';
    const message = form.get('message') || '';
    const file = form.get('proof');

    if (!name || !email || !amount || amount <= 0) {
      return NextResponse.json(
        { message: 'Nama, email, dan nominal donasi tidak valid.' },
        { status: 422 }
      );
    }
    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: 'Bukti transfer wajib diunggah.' },
        { status: 422 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Ukuran file maksimal 5 MB.' },
        { status: 422 }
      );
    }

    const uploadsDir = '/tmp/uploads';
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.type.startsWith('image/')
      ? file.type.split('/')[1] || 'jpg'
      : 'pdf';
    const safeName = `bukti-${activityId}-${Date.now()}.${ext}`;
    const proofPath = path.join(uploadsDir, safeName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(proofPath, buffer);

    const donation = await prisma.donation.create({
      data: {
        activityId,
        name,
        email,
        phone,
        amount: new Prisma.Decimal(amount),
        method,
        message,
        proofPath,
        status: 'PENDING',
      },
      include: {
        activity: {
          include: { organization: true },
        },
      },
    });

    // CREATE NOTIFICATION
    await prisma.notification.create({
      data: {
        userId: donation.activity.organization.ownerId, // id owner organisasi
        message: `${name} melakukan donasi pada kegiatan ${donation.activity.name}`,
        kind: 'DONATION_APPLY',
        url: `/activities/${activityId}`,
      },
    });

    return NextResponse.json({
      ok: true,
      activityId: donation.activityId,
      donationId: donation.id,
      message: 'Donasi berhasil dikirim. Menunggu verifikasi.',
    });
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json(
      { message: 'Gagal memproses donasi. Silakan coba lagi.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
