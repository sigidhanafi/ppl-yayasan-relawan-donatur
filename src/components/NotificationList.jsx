'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bell, Mail, MailOpen, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

function timeAgo(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const diff = Math.max(0, Date.now() - d.getTime());
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const dd = Math.floor(h / 24);
  if (dd < 7) return `${dd}d`;
  return d.toLocaleString();
}

export default function NotificationList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      if (!res.ok) throw new Error('Gagal memuat notifikasi');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.items || []);

      console.log('data', data);
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className='w-full mx-auto'>
      {/* <div className='mb-4 flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-lg font-semibold text-slate-900'>
          <Bell className='h-5 w-5' /> Notifikasi
        </h2>
        <button
          onClick={load}
          className='inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50'
        >
          <RefreshCcw className='h-4 w-4' /> Muat Ulang
        </button>
      </div> */}

      {error && (
        <div className='mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700'>
          {error}
        </div>
      )}

      {loading ? (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='animate-pulse rounded-md border border-slate-200 p-3'
            >
              <div className='h-4 w-40 bg-slate-200 rounded mb-2' />
              <div className='h-3 w-full bg-slate-200 rounded' />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className='rounded-md border border-slate-200 p-6 text-center text-slate-600'>
          Tidak ada notifikasi.
        </div>
      ) : (
        <ul className='space-y-2'>
          {items.map((n) => {
            const unread = !n.readAt;
            return (
              <li
                key={n.id}
                className={`rounded-md border p-4 transition ${
                  unread
                    ? 'border-sky-200 bg-sky-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2 text-sm text-slate-500'>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 ${
                          unread
                            ? 'border-sky-300 bg-white text-sky-700'
                            : 'border-slate-200 bg-slate-100 text-slate-700'
                        }`}
                      >
                        {unread ? (
                          <Mail className='h-3.5 w-3.5' />
                        ) : (
                          <MailOpen className='h-3.5 w-3.5' />
                        )}
                        {n.kind || 'NOTIF'}
                      </span>
                      <span className='truncate'>• {timeAgo(n.createdAt)}</span>
                    </div>
                    {/* <p className='mt-1 text-slate-900 text-sm sm:text-base break-words'>
                      {n.message}
                    </p> */}
                    {n.url ? (
                      <Link
                        href={n.url}
                        className='text-sky-600 hover:underline'
                      >
                        <p className='mt-1 text-slate-900 text-sm sm:text-base break-words'>
                          {n.message}
                        </p>
                      </Link>
                    ) : (
                      n.message
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
