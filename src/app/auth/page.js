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

      <section className='bg-gradient-to-b from-sky-50 to-white'>
        <div className='mx-auto max-w-6xl px-4 py-12'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900'>
            Daftarkan sebagai Pengelola Yayasan
          </h1>
          <p className='mt-3 text-slate-700'>
            bagikan kegiatan sosial, edukasi, dan kesehatan dari Yayasan Anda.{' '}
            <br />
            Lalu ajak relawan dan donatur melihat perkembangan kegiatan Yayasan
            Anda.
          </p>
          <SignInButton />
        </div>
      </section>
    </main>
  );
}
