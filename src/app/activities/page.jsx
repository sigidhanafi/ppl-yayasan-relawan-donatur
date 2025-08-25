import { getSession } from '@/lib/auth';
import TopNav from '@/components/TopNav';
import ActivityList from '@/components/ActivityList';

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className='min-h-screen bg-white text-slate-900'>
      {/* Top Nav */}
      <TopNav user={session && session.user} />

      {/* Hero */}
      <section className=''>
        <div className='mx-auto max-w-6xl px-4 py-12'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900'>
            Kegiatan Yayasan Anda
          </h1>
          <p className='mt-3 text-slate-700'>
            Kelola kegiatan sosial, edukasi, dan kesehatan dari Yayasan Anda,
            lalu bagikan progres kepada relawan dan donatur.
          </p>

          {/* Filters */}
          {/* <div className='mt-8 grid grid-cols-1 md:grid-cols-4 gap-3'>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Cari judul, lokasi…'
              className='rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-sky-300'
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='rounded-md border border-slate-300 bg-white px-2 py-2 shadow-sm focus:ring-2 focus:ring-sky-300'
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'Semua kategori' : c}
                </option>
              ))}
            </select>

            <label className='flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm'>
              <input
                type='checkbox'
                className='size-4 accent-sky-500'
                checked={upcoming}
                onChange={(e) => setUpcoming(e.target.checked)}
              />
              <span className='text-slate-800'>Tampilkan yang akan datang</span>
            </label>

            <button
              onClick={() => {
                setQ('');
                setCategory('all');
                setUpcoming(true);
              }}
              className='rounded-md bg-sky-500 px-4 py-2 font-medium text-white hover:bg-sky-600 active:opacity-90 cursor-pointer'
            >
              Reset
            </button>
          </div> */}
        </div>
      </section>

      {/* Grid */}
      <ActivityList
        isShowAdd={
          session && session.user && session.user.organizationId != null
        }
      />
    </main>
  );
}
