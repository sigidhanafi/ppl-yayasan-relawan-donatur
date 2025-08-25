'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ActivityForm({ user }) {
  const router = useRouter();
  const sp = useSearchParams();
  const orgIdParam = sp.get('orgId');

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);

  function localDatetimeToISO(dtLocal) {
    if (!dtLocal) return null;
    return new Date(dtLocal).toISOString();
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      organizationId: Number(fd.get('organizationId')), // hidden
      name: fd.get('name')?.toString().trim(),
      description: fd.get('description')?.toString().trim() || '',
      date: localDatetimeToISO(fd.get('date')),
      status: fd.get('status'), // hidden, default DRAFT
      volunteerRequirement:
        fd.get('volunteerRequirement')?.toString().trim() || null,
      donationInstruction:
        fd.get('donationInstruction')?.toString().trim() || null,
      location: fd.get('location')?.toString().trim() || null,
      quota: fd.get('quota') ? Number(fd.get('quota')) : null,
      coverUrl: fd.get('coverUrl')?.toString().trim() || null,
    };

    if (!payload.organizationId || isNaN(payload.organizationId)) {
      setErr('Organization ID wajib ada.');
      return;
    }
    if (!payload.name) {
      setErr('Nama aktivitas wajib diisi.');
      return;
    }
    if (!payload.date) {
      setErr('Tanggal wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || 'Gagal menyimpan aktivitas.');
      }

      setOk('Aktivitas berhasil dibuat.');
      e.target.reset();
      setTimeout(() => router.push('/activities'), 1000);
    } catch (error) {
      setErr(error.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className='mt-4 rounded-xl bg-white p-4'>
      <h3 className='text-lg font-semibold text-slate-900'>Form Aktivitas</h3>
      <p className='mt-1 text-sm text-slate-600'>
        Isi data berikut untuk menambahkan aktivitas baru.
      </p>

      {/* hidden fields */}
      <input
        type='hidden'
        name='organizationId'
        value={user.organizationId ?? ''}
      />
      <input type='hidden' name='status' value='DRAFT' />

      <div className='mt-4 grid gap-3 md:grid-cols-2'>
        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-slate-700'>
            Nama Aktivitas *
          </label>
          <input
            name='name'
            required
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Mis. Bakti Sosial'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Tanggal & Waktu *
          </label>
          <input
            type='datetime-local'
            name='date'
            required
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
          />
        </div>

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-slate-700'>
            Deskripsi
          </label>
          <textarea
            name='description'
            rows={3}
            required
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Tuliskan detail aktivitas...'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Syarat Relawan
          </label>
          <textarea
            name='volunteerRequirement'
            rows={2}
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Cara Berdonasi
          </label>
          <textarea
            name='donationInstruction'
            rows={2}
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Lokasi
          </label>
          <input
            name='location'
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Alamat/lokasi kegiatan'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Kuota Relawan
          </label>
          <input
            type='number'
            name='quota'
            min='0'
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='100'
          />
        </div>

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-slate-700'>
            Cover URL
          </label>
          <input
            type='url'
            name='coverUrl'
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='https://...'
          />
        </div>
      </div>

      {err && (
        <div className='mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700'>
          {err}
        </div>
      )}
      {ok && (
        <div className='mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>
          {ok}
        </div>
      )}

      <div className='mt-4 flex items-center gap-2'>
        <button
          type='submit'
          disabled={loading}
          className={`rounded-lg px-4 py-2 font-medium text-white ${
            loading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-700'
          }`}
        >
          {loading ? 'Menyimpan...' : 'Simpan Aktivitas'}
        </button>
        <button
          type='button'
          onClick={() => router.back()}
          className='rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300'
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
