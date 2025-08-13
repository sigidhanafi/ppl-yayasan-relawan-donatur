'use client';

import { useEffect, useMemo, useState } from 'react';
import ActivityCard from '@/components/ActivityCard';

const CATEGORIES = ['all', 'Edukasi', 'Sosial', 'Kesehatan'];

export default function ActivityListPage() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [upcoming, setUpcoming] = useState(true);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (category) sp.set('category', category);
    if (upcoming) sp.set('upcoming', 'true');
    return sp.toString();
  }, [q, category, upcoming]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/activities?${queryString}`)
      .then((r) => r.json())
      .then((res) => setItems(res.data || []))
      .finally(() => setLoading(false));
  }, [queryString]);

  return (
    <main className='min-h-screen bg-white text-slate-900'>
      {/* Hero */}
      <section className='bg-gradient-to-b from-sky-50 to-white'>
        <div className='mx-auto max-w-6xl px-4 py-12'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900'>
            Kegiatan Yayasan & Relawan
          </h1>
          <p className='mt-3 text-slate-700'>
            Temukan kegiatan sosial, edukasi, dan kesehatan. Ayo bergabung
            sebagai relawan!
          </p>

          {/* Filters */}
          <div className='mt-8 grid grid-cols-1 md:grid-cols-4 gap-3'>
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
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className='mx-auto max-w-6xl px-4 pb-16'>
        {loading ? (
          <div className='py-12 text-center text-slate-500'>Memuat…</div>
        ) : items.length === 0 ? (
          <div className='py-16 text-center text-slate-500'>
            Tidak ada kegiatan ditemukan.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {items.map((a) => (
              <ActivityCard key={a.id} a={a} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
