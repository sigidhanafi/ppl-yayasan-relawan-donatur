import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toUTC, nonNegOrNull, assertRequired } from '@/lib/util';

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

    const created = await prisma.activity.create({
      data: {
        organizationId: Number(body.organizationId),
        name: String(body.name),
        description: String(body.description),
        date: toUTC(String(body.date)),
        status: body.status || 'DRAFT',
        volunteerRequirement: body.volunteerRequirement ?? null,
        donationInstruction: body.donationInstruction ?? null,
        location: body.location ?? null,
        quota: nonNegOrNull(body.quota), // <= validasi non-negatif
        coverUrl: body.coverUrl ?? null,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || 'Invalid payload' },
      { status: 400 }
    );
  }
}
