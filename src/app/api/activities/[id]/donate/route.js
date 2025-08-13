import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs'; // pastikan Node.js runtime (bukan edge)

export async function POST(req, { params }) {
  try {
    const id = params.id;
    const form = await req.formData();

    const name = form.get('name') || '';
    const email = form.get('email') || '';
    const amount = Number(form.get('amount') || 0);
    const method = form.get('method') || 'transfer';
    const notes = form.get('notes') || '';
    const file = form.get('proof');

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: 'Nominal donasi tidak valid.' },
        { status: 422 }
      );
    }
    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: 'Bukti transfer wajib diunggah.' },
        { status: 422 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Ukuran file maksimal 5 MB.' },
        { status: 422 }
      );
    }

    // simpan file ke /tmp/uploads (ephemeral di serverless; persistent di container dev)
    const uploadsDir = '/tmp/uploads';
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.type.startsWith('image/')
      ? file.type.split('/')[1] || 'jpg'
      : 'pdf';
    const safeName = `bukti-${id}-${Date.now()}.${ext}`;
    const dest = path.join(uploadsDir, safeName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(dest, buffer);

    // TODO: simpan metadata donasi ke DB jika diperlukan
    return NextResponse.json({
      ok: true,
      activityId: id,
      storedFile: `/tmp/uploads/${safeName}`, // hanya informasi; jangan diekspos publik di prod
      data: { name, email, amount, method, notes },
      receivedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: 'Gagal memproses donasi.' },
      { status: 500 }
    );
  }
}
