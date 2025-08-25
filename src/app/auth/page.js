import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignInButton from '@/components/SignInButton';
import TopNav from '@/components/TopNav';

export default async function RegisterPage() {
  const session = await getSession();

  if (session && session?.user) {
    redirect('/auth/route-decider');
  }

  return (
    <main className='min-h-screen bg-white text-slate-900'>
      {/* Top Nav */}
      <TopNav />

      {/* <section className='bg-gradient-to-b from-sky-50 to-white'>
        <div className='mx-auto max-w-6xl px-4 py-12'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900'>
            Mari bersama mendukung kebaikan
          </h1>
          <p className='mt-3 text-slate-700'>
            Bergabunglah sebagai pengelola yayasan dan bagikan kegiatan sosial,
            edukasi, dan kesehatan dari Yayasan Anda. <br />
            Ajak relawan dan donatur melihat perkembangan kegiatan Yayasan Anda.
          </p>
          <SignInButton />
        </div>
      </section> */}

      {/* Hero */}
      <section className='bg-gradient-to-b from-sky-50 to-white'>
        <div className='mx-auto max-w-6xl px-4 py-12'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900'>
            Mari bersama dijalan kebaikan
          </h1>
          <p className='mt-3 text-slate-700'>
            Bagikan kegiatan sosial, edukasi, dan kesehatan dari Yayasan Anda.{' '}
            <br />
            Ajak relawan dan donatur melihat perkembangan kegiatan Yayasan Anda.
          </p>
        </div>
      </section>

      {/* Dua kotak */}
      <section className='mx-auto max-w-6xl px-4 py-12'>
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Kiri: Relawan */}
          <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition'>
            <h2 className='text-2xl font-bold text-slate-900'>Untuk Relawan</h2>
            <p className='mt-2 text-slate-600'>
              Kelola kegiatan sosial, edukasi, dan kesehatan dari berbagai
              yayasan. Daftarkan diri Anda sebagai relawan dan ikut
              berkontribusi nyata.
            </p>
            <div className='mt-4'>
              {/* <Link
                href='/activities'
                className='inline-flex items-center rounded-md bg-sky-500 px-4 py-2 font-medium text-white hover:bg-sky-600'
              >
                Lihat Kegiatan
              </Link> */}
              <SignInButton />
            </div>
          </div>

          {/* Kanan: Pengelola Yayasan */}
          <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition'>
            <h2 className='text-2xl font-bold text-slate-900'>
              Untuk Pengelola Yayasan
            </h2>
            <p className='mt-2 text-slate-600'>
              Daftarkan Yayasan Anda, kelola kegiatan sosial, edukasi, dan
              kesehatan. Ajak relawan serta donatur untuk mendukung program
              Yayasan Anda.
            </p>
            <div className='mt-4'>
              {/* <Link
                href='/auth'
                className='inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600'
              >
                Masuk / Daftar
              </Link> */}
              <SignInButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
