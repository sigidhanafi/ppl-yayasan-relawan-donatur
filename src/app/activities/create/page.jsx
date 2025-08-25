import { getSession } from '@/lib/auth';
import ActivityForm from '@/components/ActivityForm';
import TopNav from '@/components/TopNav';

export default async function CreateActivityPage() {
  const session = await getSession();

  return (
    <main className='min-h-screen bg-white text-slate-900'>
      {/* Top Nav */}
      <TopNav user={session && session.user} />

      <section className='bg-gradient-to-b from-sky-50 to-white'>
        <div className='mx-auto max-w-6xl px-4 pt-12'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900'>
            Tambah Aktivitas
          </h1>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 pb-16'>
        <ActivityForm user={session && session.user} />
      </section>
    </main>
  );
}
