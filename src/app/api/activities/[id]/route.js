import { NextResponse } from 'next/server';
import { activities } from '@/lib/mockActivities';

export async function GET(_req, { params }) {
  const act = activities.find((a) => a.id === params.id);
  if (!act) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: act });
}
