import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const idParam = parseInt(id);

    if (!idParam || Number.isNaN(idParam)) {
      return NextResponse.json(
        { error: 'Invalid organization id' },
        { status: 400 }
      );
    }

    const org = await prisma.organization.findUnique({
      where: { id: idParam },
      select: {
        id: true,
        name: true,
        address: true,
        description: true,
        // phone: true,
        // coverUrl: true,
        // createdAt: true,
        // updatedAt: true,
      },
    });

    if (!org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // hindari cache agar selalu fresh
    return NextResponse.json(org, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    console.error('GET /api/organizations/[id] error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
