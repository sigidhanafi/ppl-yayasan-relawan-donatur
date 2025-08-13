import { NextResponse } from 'next/server';

import { activities } from '@/lib/mockActivities';

const mock = activities;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const cat = searchParams.get('category') || 'all';
  const upcoming = searchParams.get('upcoming') === 'true';

  let data = mock;

  if (q) {
    data = data.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        (d.summary ?? '').toLowerCase().includes(q)
    );
  }
  if (cat !== 'all') {
    data = data.filter((d) => d.category === cat);
  }
  if (upcoming) {
    data = data.filter((d) => new Date(d.date) >= new Date());
  }

  return NextResponse.json({ data });
}
