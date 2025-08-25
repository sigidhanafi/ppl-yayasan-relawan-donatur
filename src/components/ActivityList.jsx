'use client';
import { useEffect, useMemo, useState } from 'react';
import ActivityCard from '@/components/ActivityCard';
import ActivityCreateCard from './ActivityCreateCard';

const CATEGORIES = ['all', 'Edukasi', 'Sosial', 'Kesehatan'];

export default function ActivityList({ isShowAdd }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [upcoming, setUpcoming] = useState(true);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (category) sp.set('category', category);
    if (upcoming) sp.set('upcoming', 'true');
    return sp.toString();
  }, [q, category, upcoming]);

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/activities?${queryString}`);
        const data = await res.json();
        if (!ignore) {
          setItems(data.items || []); // sesuai struktur respons API
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error('Failed fetch activities:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true; // cleanup
    };
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
          {isShowAdd && <ActivityCreateCard />}
          {items.map((a) => (
            <ActivityCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </section>
  );
}
