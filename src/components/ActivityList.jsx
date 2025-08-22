'use client';
import { useEffect, useMemo, useState } from 'react';
import ActivityCard from '@/components/ActivityCard';

const CATEGORIES = ['all', 'Edukasi', 'Sosial', 'Kesehatan'];

export default function ActivityList() {
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
  );
}
