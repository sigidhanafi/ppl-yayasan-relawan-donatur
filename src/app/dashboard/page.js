import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CircleUser } from 'lucide-react';
import TopNav from '@/components/TopNav';

async function getOrganization(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizations/${id}`,
    { cache: 'no-store' } // selalu fresh
  );
  if (!res.ok) {
    // bisa lempar error / return null
    return null;
  }
  return res.json();
}

// Helper: format rupiah
function formatIDR(n) {
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch {
    return `Rp${Number(n || 0).toLocaleString('id-ID')}`;
  }
}

export default async function DashboardPage() {
  // Proteksi
  const session = await getSession();
  if (!session?.user) redirect('/auth');

  const organization = await getOrganization(session.user.organizationId);

  // Ambil statistik
  const [activitiesCompleted, volunteersVerified, donationsAgg] =
    await prisma.$transaction([
      prisma.activity.count({ where: { status: 'COMPLETED' } }),
      prisma.volunteerActivity.count({ where: { status: 'VERIFIED' } }),
      prisma.donation.aggregate({
        where: { status: 'APPROVED' },
        _sum: { amount: true },
      }),
    ]);

  const totalDonations = Number(donationsAgg._sum?.amount || 0);

  return (
    <main className='min-h-screen bg-white text-slate-900'>
      {/* Top Nav */}
      <TopNav user={session.user} />

      {/* Hero */}
      <section className=''>
        <div className='mx-auto max-w-6xl px-4 py-10'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
            Dashboard
          </h1>
          <p className='mt-3 text-slate-700'>
            Ringkasan aktivitas yayasan, relawan, dan donasi.
          </p>
        </div>
      </section>

      {organization && (
        <section className=''>
          <div className='mx-auto max-w-6xl px-4 py-10'>
            <h2 className='text-xl font-bold text-slate-900'>
              {organization.name}
            </h2>
            <p className='mt-1 text-slate-600'>
              📍 {organization.address ?? 'Alamat belum tersedia'}
            </p>
          </div>
        </section>
      )}

      {/* Cards */}
      <section className='mx-auto max-w-6xl px-4 pb-16'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {/* Aktivitas terlaksana */}
          <div className='rounded-md border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='text-sm font-medium text-slate-600'>
              Aktivitas Terlaksana
            </div>
            <div className='mt-2 text-4xl font-extrabold text-slate-900'>
              {activitiesCompleted}
            </div>
            <p className='mt-1 text-sm text-slate-500'>
              Total kegiatan berstatus{' '}
              <span className='font-semibold'>COMPLETED</span>.
            </p>
          </div>

          {/* Jumlah relawan */}
          <div className='rounded-md border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='text-sm font-medium text-slate-600'>
              Jumlah Relawan
            </div>
            <div className='mt-2 text-4xl font-extrabold text-slate-900'>
              {volunteersVerified}
            </div>
            <p className='mt-1 text-sm text-slate-500'>
              Berdasarkan pendaftaran relawan berstatus{' '}
              <span className='font-semibold'>VERIFIED</span>.
            </p>
          </div>

          {/* Total Donasi */}
          <div className='rounded-md border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='text-sm font-medium text-slate-600'>
              Total Donasi
            </div>
            <div className='mt-2 text-4xl font-extrabold text-slate-900'>
              {formatIDR(totalDonations)}
            </div>
            <p className='mt-1 text-sm text-slate-500'>
              Akumulasi donasi berstatus{' '}
              <span className='font-semibold'>APPROVED</span>.
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className='mt-8 grid gap-3 sm:flex'>
          <a
            href='/activities'
            className='inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-slate-700 shadow-sm hover:bg-slate-50'
          >
            Lihat Kegiatan Saya
          </a>
          <a
            href='/volunteers'
            className='inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-slate-700 shadow-sm hover:bg-slate-50'
          >
            Kelola Relawan
          </a>
          <a
            href='/donations'
            className='inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700'
          >
            Kelola Donasi
          </a>
        </div>
      </section>
    </main>
  );
}
