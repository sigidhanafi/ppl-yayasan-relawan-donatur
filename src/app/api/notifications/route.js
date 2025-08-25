import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(_req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id; // pastikan `id` ada di token NextAuth

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const items = notifications.map((n) => ({
      id: n.id,
      message: n.message,
      kind: n.kind,
      url: n.url,
      createdAt: n.createdAt?.toISOString(),
      readAt: n.readAt ? n.readAt.toISOString() : null,
    }));

    return Response.json(items);
  } catch (err) {
    console.error('GET /api/notifications error', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
