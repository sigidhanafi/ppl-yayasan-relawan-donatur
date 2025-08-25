import Link from 'next/link';
import { getSession } from '@/lib/auth';
import VolunteerForm from '@/components/VolunteerForm';
import RelawanCard from '@/components/RelawanCard';
import DonationCard from '@/components/DonationCard';
import TopNav from '@/components/TopNav';
import RelawanList from '@/components/RelawanList';

async function getActivity(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}/api/activities/${id}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed fetch activities:', err);
  } finally {
  }
}

export default async function ActivityDetailPage({ params }) {
  const session = await getSession();
  const { id } = await params;
  const act = await getActivity(id);

  console.log('ACT', act);

  if (!act) {
    return (
      <main className='bg-white mx-auto max-w-3xl px-4 py-16'>
        <h1 className='text-3xl font-semibold'>Kegiatan tidak ditemukan</h1>
        <Link
          href='/'
          className='mt-6 inline-block text-sky-600 hover:underline text-lg'
        >
          ← Kembali
        </Link>
      </main>
    );
  }

  const d = new Date(act.date);
  const isPast = d < new Date();

  const formattedDate = d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main className='min-h-screen bg-white text-slate-900'>
      {/* Top Nav */}
      <TopNav user={session && session.user} />

      <section className='bg-white'>
        <div className='mx-auto max-w-5xl px-4 py-8'>
          {/* breadcrumb */}
          <nav className='text-base text-slate-600'>
            <Link href='/' className='hover:underline'>
              Beranda
            </Link>
            <span className='mx-2'>/</span>
            <Link href='/#kegiatan' className='hover:underline'>
              Kegiatan
            </Link>
            <span className='mx-2'>/</span>
            <span className='text-slate-900'>{act.name}</span>
          </nav>

          {/* header */}
          <div className='mt-6 flex flex-col gap-6 md:flex-row md:items-start'>
            {/* bigger image */}
            <div className='flex-shrink-0'>
              {act.coverUrl ? (
                <img
                  src={act.coverUrl}
                  alt={act.title}
                  className='h-48 w-64 md:h-56 md:w-72 rounded-xl object-cover'
                />
              ) : (
                <div className='grid h-48 w-64 md:h-56 md:w-72 place-items-center rounded-xl bg-slate-100 text-base text-slate-500'>
                  Tidak ada gambar
                </div>
              )}
            </div>

            {/* info */}
            <div className='md:ml-8 flex-1'>
              {/* Title + Share */}
              <div className='flex items-center justify-between gap-3 flex-wrap'>
                <h1 className='text-3xl md:text-4xl font-bold text-slate-900'>
                  {act.name}
                </h1>
              </div>

              {/* <div className='mt-3 flex flex-wrap items-center gap-3 text-sm'>
                <span className='inline-flex items-center rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-700'>
                  {act.category}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${
                    isPast
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isPast ? 'Selesai' : 'Akan datang'}
                </span>
              </div> */}

              {/* meta */}
              <div className='flex mt-4 text-base text-slate-700 max-w-md space-y-2 space-x-10'>
                <div>📍 {act.location}</div>
                <div>
                  🗓️ {formattedDate} • {formattedTime} WIB
                </div>
              </div>

              {/* TABS: Deskripsi / Kandidat Relawan / Cara Berdonasi */}
              <div
                className='mt-6
                /* Panel visibility */
                [&:has(#tab-deskripsi:checked)_#panel-deskripsi]:block
                [&:has(#tab-kandidat:checked)_#panel-kandidat]:block
                [&:has(#tab-donasi:checked)_#panel-donasi]:block
                '
              >
                {/* HEADER: setiap input diikuti label → peer bekerja */}
                <div className='flex'>
                  {/* Deskripsi */}
                  <span className='inline-block'>
                    <input
                      type='radio'
                      name='activity-tabs'
                      id='tab-deskripsi'
                      defaultChecked
                      className='peer hidden'
                    />
                    <label
                      htmlFor='tab-deskripsi'
                      className='cursor-pointer px-4 py-2 text-slate-600 hover:text-slate-900 
                   border-b-2 border-transparent
                   peer-checked:border-sky-600 peer-checked:text-slate-900 font-bold'
                    >
                      Deskripsi
                    </label>
                  </span>

                  {/* Kandidat */}
                  <span className='inline-block'>
                    <input
                      type='radio'
                      name='activity-tabs'
                      id='tab-kandidat'
                      className='peer hidden'
                    />
                    <label
                      htmlFor='tab-kandidat'
                      className='cursor-pointer px-4 py-2 text-slate-600 hover:text-slate-900 
                   border-b-2 border-transparent
                   peer-checked:border-sky-600 peer-checked:text-slate-900 font-bold'
                    >
                      Syarat Relawan
                    </label>
                  </span>

                  {/* Donasi */}
                  <span className='inline-block'>
                    <input
                      type='radio'
                      name='activity-tabs'
                      id='tab-donasi'
                      className='peer hidden'
                    />
                    <label
                      htmlFor='tab-donasi'
                      className='cursor-pointer px-4 py-2 text-slate-600 hover:text-slate-900 
                   border-b-2 border-transparent
                   peer-checked:border-sky-600 peer-checked:text-slate-900 font-bold'
                    >
                      Cara Berdonasi
                    </label>
                  </span>
                </div>

                {/* PANELS */}
                <div className='mt-4 rounded-md border border-slate-200 p-4'>
                  <div id='panel-deskripsi' className='hidden'>
                    <h2 className='text-lg font-semibold text-slate-900'>
                      Deskripsi Kegiatan
                    </h2>
                    <p className='mt-2 text-slate-700 text-base leading-relaxed'>
                      {act.description ?? 'Tidak ada deskripsi.'}
                    </p>
                  </div>

                  <div id='panel-kandidat' className='hidden'>
                    <h2 className='text-lg font-semibold text-slate-900'>
                      Syarat Kandidat Relawan
                    </h2>

                    <p className='mt-2 text-slate-700 text-base leading-relaxed'>
                      {act.volunteerRequirement ??
                        'Tidak ada syarat kandidat relawan.'}
                    </p>

                    {/* {Array.isArray(act.requirements) &&
                    act.requirements.length > 0 ? (
                      <ul className='mt-2 list-disc pl-5 text-slate-700 text-base leading-relaxed space-y-1'>
                        {act.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className='mt-2 text-slate-700 text-base leading-relaxed'>
                        Belum ada syarat kandidat yang tersedia.
                      </p>
                    )} */}
                  </div>

                  {/* Panel Donasi */}
                  <div id='panel-donasi' className='hidden'>
                    <h2 className='text-lg font-semibold text-slate-900'>
                      Tata Cara Berdonasi
                    </h2>

                    <p className='mt-2 text-slate-700 text-base leading-relaxed'>
                      {act.donationInsturction ?? 'Tidak ada cara berdonasi.'}
                    </p>

                    {/* {act.donation_instructions ? (
                      // whitespace-pre-line agar baris baru dari string ikut tampil rapi
                      <p className='mt-2 text-slate-700 text-base leading-relaxed whitespace-pre-line'>
                        {act.donation_instructions}
                      </p>
                    ) : (
                      <ol className='mt-2 list-decimal pl-5 text-slate-700 text-base leading-relaxed space-y-1'>
                        <li>Pilih nominal donasi yang diinginkan.</li>
                        <li>
                          Transfer ke rekening resmi yayasan / payment gateway.
                        </li>
                        <li>
                          Unggah bukti pembayaran (bila diminta) dan konfirmasi.
                        </li>
                      </ol>
                    )} */}
                  </div>
                </div>
              </div>

              {session && session.user.role == 'ORGANISASI' && (
                <RelawanList rows={act.volunteers} />
              )}

              {session && session.user.role != 'ORGANISASI' && (
                <RelawanCard
                  act={act}
                  isPast={isPast}
                  params={params}
                  session={session}
                />
              )}

              {!session && (
                <RelawanCard
                  act={act}
                  isPast={isPast}
                  params={params}
                  session={session}
                />
              )}

              {/* Card Donasi */}
              {/* <DonationCard act={act} isPast={isPast} activityId={params.id} /> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
