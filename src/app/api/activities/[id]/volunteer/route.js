import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  const id = params.id;
  let body = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, phone, availability, skills, notes, agree } = body || {};
  if (!name || !email || !phone) {
    return NextResponse.json(
      { message: 'Nama, email, dan nomor HP wajib diisi.' },
      { status: 422 }
    );
  }
  if (!agree) {
    return NextResponse.json(
      { message: 'Kamu harus menyetujui ketentuan relawan.' },
      { status: 422 }
    );
  }

  // TODO: simpan ke DB / kirim notifikasi
  return NextResponse.json({
    ok: true,
    activityId: id,
    receivedAt: new Date().toISOString(),
    data: { name, email, phone, availability, skills, notes },
  });
}
