import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const ALLOWED = ['approve', 'reject'];

function nextStatusFromAction(action) {
  if (action === 'approve') return 'APPROVED';
  if (action === 'reject') return 'REJECTED';
  const e = new Error(`Invalid action. Use one of: ${ALLOWED.join(', ')}`);
  e.code = 'VALIDATION';
  throw e;
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const idParam = parseInt(id);

    if (!idParam || Number.isNaN(idParam)) {
      return NextResponse.json(
        { error: 'Invalid donation id' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const sessionOrgId = session?.user?.organizationId ?? null;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || '').toLowerCase();
    if (!ALLOWED.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Allowed: ${ALLOWED.join(', ')}` },
        { status: 422 }
      );
    }
    const targetStatus = nextStatusFromAction(action);

    // optional rule: hanya boleh transition dari PENDING
    // if (va.status !== 'PENDING') {
    //   return NextResponse.json(
    //     {
    //       error: `Status saat ini ${va.status}. Hanya PENDING yang bisa diubah.`,
    //     },
    //     { status: 422 }
    //   );
    // }

    const updated = await prisma.donation.update({
      where: { id: idParam },
      data: { status: targetStatus },
      select: {
        id: true,
        status: true,
        activityId: true,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    if (e?.code === 'NOT_FOUND') {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    if (e?.code === 'FORBIDDEN') {
      return NextResponse.json({ error: e.message }, { status: 403 });
    }
    if (e?.code === 'VALIDATION') {
      return NextResponse.json({ error: e.message }, { status: 422 });
    }
    console.error('PATCH /api/donation-activities/[id] error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
