import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; // helper getServerSession(authOptions)
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const choice = (form.get('choice') || '').toString(); // 'RELAWAN' | 'OWNER' | 'DONATUR'
    const name = (form.get('name') || '').toString();
    const address = (form.get('address') || '').toString();

    if (!name.trim() || !address.trim()) {
      return NextResponse.json(
        { message: 'Nama dan alamat wajib diisi.' },
        { status: 400 }
      );
    }

    // update profil user
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, address },
    });

    if (choice === 'OWNER') {
      // cek apakah owner sudah punya organisasi
      const existing = await prisma.organization.findUnique({
        where: { ownerId: user.id },
        select: { id: true },
      });

      if (existing) {
        return NextResponse.json(
          { message: 'Anda sudah memiliki yayasan.' },
          { status: 409 }
        );
      }

      const orgName = (form.get('orgName') || '').toString();
      const orgAddress = (form.get('orgAddress') || '').toString();
      const orgDescription = (form.get('orgDescription') || '').toString();
      const orgDoc = form.get('orgDoc'); // bisa null atau file

      if (!orgName.trim() || !orgAddress.trim()) {
        return NextResponse.json(
          { message: 'Nama yayasan dan alamat yayasan wajib diisi.' },
          { status: 400 }
        );
      }

      // Simpan file jika ada (opsional). Contoh: upload ke S3/GCS lalu simpan URL.
      let docUrl = null;
      if (orgDoc && typeof orgDoc === 'object') {
        // Contoh pseudo—implement real upload sesuai storage kamu:
        // const bytes = await orgDoc.arrayBuffer();
        // const buffer = Buffer.from(bytes);
        // docUrl = await uploadToStorage(buffer, orgDoc.name, orgDoc.type);
      }

      // Buat organisasi status PENDING
      const org = await prisma.organization.create({
        data: {
          name: orgName,
          description: orgDescription || null,
          address: orgAddress,
          isVerified: false,
          owner: { connect: { id: user.id } },
        },
      });

      // // Assign user sebagai owner (pastikan constraint 1 user 1 org jika perlu)
      // await prisma.organizationOwner.create({
      //   data: { userId: user.id, orgId: org.id },
      // });

      // Simpan metadata dokumen kalau ada
      // if (docUrl) {
      //   await prisma.organizationDocument.create({
      //     data: {
      //       organizationId: org.id,
      //       url: docUrl,
      //       type: 'LEGAL',
      //     },
      //   });
      // }

      // Tandai onboarding choice
      await prisma.user.update({
        where: { id: user.id },
        data: {
          organization: { connect: { id: org.id } },
          role: 'ORGANISASI',
        },
      });
    } else {
      // RELAWAN / DONATUR
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'USER' },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: 'Gagal menyimpan data.' },
      { status: 500 }
    );
  }
}
