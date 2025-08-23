import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    console.log('PARAM', id);
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

export async function PATCH(req, { params }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id))
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    const body = await req.json();

    const data = {};
    if (body.name !== undefined) data.name = String(body.name);
    if (body.description !== undefined)
      data.description = String(body.description);
    if (body.date !== undefined) data.date = toUTC(String(body.date));
    if (body.status !== undefined) data.status = String(body.status);
    if (body.volunteerRequirement !== undefined)
      data.volunteerRequirement = body.volunteerRequirement ?? null;
    if (body.donationInstruction !== undefined)
      data.donationInstruction = body.donationInstruction ?? null;
    if (body.location !== undefined) data.location = body.location ?? null;
    if (body.quota !== undefined) data.quota = nonNegOrNull(body.quota);
    if (body.coverUrl !== undefined) data.coverUrl = body.coverUrl ?? null;

    const updated = await prisma.activity.update({
      where: { id },
      data,
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
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    if (e.code === 'P2025')
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(
      { error: e?.message || 'Invalid payload' },
      { status: 400 }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id))
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    await prisma.activity.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e.code === 'P2025')
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    );
  }
}
