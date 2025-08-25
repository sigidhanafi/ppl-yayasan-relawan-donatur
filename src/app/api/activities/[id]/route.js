import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { nonNegOrNull } from '@/lib/util';

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const idParam = parseInt(id);

    if (!idParam || Number.isNaN(idParam)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const data = await prisma.activity.findUnique({
      where: { id: idParam },
      include: {
        _count: { select: { volunteers: true, donations: true } },
        volunteers: {
          select: {
            id: true,
            appliedAt: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
        },
      },
    });

    if (!data)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const idParam = parseInt(id);

    if (!idParam || Number.isNaN(idParam)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // optional: cek kepemilikan (org dari session harus sama dengan org milik activity)
    const existing = await prisma.activity.findUnique({
      where: { id: idParam },
      select: { organizationId: true },
    });
    if (!existing)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const sessionOrgId = session.user.organizationId ?? null;
    if (sessionOrgId && existing.organizationId !== sessionOrgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // validasi minimal
    if (!body?.name)
      return NextResponse.json(
        { error: 'Nama aktivitas wajib diisi.' },
        { status: 422 }
      );
    if (!body?.date)
      return NextResponse.json(
        { error: 'Tanggal wajib diisi.' },
        { status: 422 }
      );

    const updated = await prisma.activity.update({
      where: { id: idParam },
      data: {
        // organizationId & status disembunyikan dari UI, tapi tetap boleh dipertahankan (atau kunci dari existing)
        organizationId: Number(body.organizationId ?? existing.organizationId),
        status: String(body.status ?? 'DRAFT'),

        name: String(body.name),
        description: String(body.description ?? ''),
        date: new Date(body.date),
        volunteerRequirement: body.volunteerRequirement ?? null,
        donationInstruction: body.donationInstruction ?? null,
        location: body.location ?? null,
        quota: nonNegOrNull(body.quota),
        coverUrl: body.coverUrl ?? null,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: updated.id });
  } catch (e) {
    if (e?.code === 'VALIDATION') {
      return NextResponse.json({ error: e.message }, { status: 422 });
    }
    console.error('PUT /api/activities/[id] error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    const idParam = parseInt(id);

    if (!idParam || Number.isNaN(idParam)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    await prisma.activity.delete({ where: { id: idParam } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log(e);
    if (e.code === 'P2025')
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    );
  }
}
