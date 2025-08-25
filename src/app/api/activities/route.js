import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  toUTC,
  nonNegOrNull,
  assertRequired,
  parseDateAny,
  pickStatus,
} from '@/lib/util';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/activities?status=&orgId=&q=&page=1&pageSize=10
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const orgId = searchParams.get('orgId');
    const q = searchParams.get('q') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '10');

    const where = {};
    if (status) where.status = status;
    if (orgId) where.organizationId = Number(orgId);
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { volunteerRequirement: { contains: q, mode: 'insensitive' } },
        { donationInstruction: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          organizationId: true,
          name: true,
          description: true,
          date: true,
          status: true,
          volunteerRequirement: true,
          donationInstruction: true,
          location: true,
          quota: true,
          coverUrl: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { volunteers: true, donations: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    );
  }
}

// POST /api/activities
export async function POST(req) {
  try {
    const body = await req.json();
    assertRequired(body, ['organizationId', 'name', 'description', 'date']);

    // (opsional) enforce via session
    const session = await getServerSession(authOptions);
    const sessionOrgId = session?.user?.organizationId ?? null;
    if (!session?.user?.id) {
      const e = new Error('Unauthorized');
      e.code = 'UNAUTHORIZED';
      throw e;
    }
    // Jika ingin strict: hanya boleh create untuk org miliknya
    if (sessionOrgId && Number(body.organizationId) !== sessionOrgId) {
      const e = new Error('Organization tidak sesuai dengan akun Anda.');
      e.code = 'FORBIDDEN';
      throw e;
    }

    const created = await prisma.activity.create({
      data: {
        organizationId: Number(body.organizationId),
        name: String(body.name),
        description: String(body.description),
        date: parseDateAny(body.date),
        status: pickStatus(body.status),
        volunteerRequirement: body.volunteerRequirement ?? null,
        donationInstruction: body.donationInstruction ?? null,
        location: body.location ?? null,
        quota: nonNegOrNull(body.quota),
        coverUrl: body.coverUrl ?? null,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e) {
    console.log('E', e);
    // Prisma FK/constraint errors
    if (e?.code === 'P2003') {
      // foreign key failed
      return NextResponse.json(
        { error: 'Organization tidak ditemukan.' },
        { status: 422 }
      );
    }
    if (e?.code === 'VALIDATION') {
      return NextResponse.json({ error: e.message }, { status: 422 });
    }
    if (e?.code === 'UNAUTHORIZED') {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    if (e?.code === 'FORBIDDEN') {
      return NextResponse.json({ error: e.message }, { status: 403 });
    }
    console.error('POST /api/activities error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
