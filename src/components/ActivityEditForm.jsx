'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

function toLocalInputValue(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  // yyyy-MM-ddTHH:mm
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${mm ? `${hh}:${mm}` : `${hh}:00`}`;
}

export default function ActivityEditForm({ activityId, initialData }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);
  const [data, setData] = useState(initialData || null);

  // fetch detail jika initialData belum ada
  useEffect(() => {
    let abort = false;
    async function load() {
      if (data) return;
      try {
        const res = await fetch(`/api/activities/${activityId}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Gagal memuat data aktivitas.');
        const j = await res.json();
        if (!abort) setData(j);
      } catch (e) {
        if (!abort) setErr(e.message || 'Terjadi kesalahan.');
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, [activityId, data]);

  const dateDefault = useMemo(
    () => toLocalInputValue(data?.date),
    [data?.date]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setOk(null);
    setErr(null);

    const fd = new FormData(e.currentTarget);

    const payload = {
      // hidden fields:
      organizationId: Number(fd.get('organizationId')),
      status: String(fd.get('status') || 'DRAFT'),

      name: fd.get('name')?.toString().trim(),
      description: fd.get('description')?.toString().trim() || '',
      date: new Date(fd.get('date')).toISOString(),
      volunteerRequirement:
        fd.get('volunteerRequirement')?.toString().trim() || null,
      donationInstruction:
        fd.get('donationInstruction')?.toString().trim() || null,
      location: fd.get('location')?.toString().trim() || null,
      quota: fd.get('quota') ? Number(fd.get('quota')) : null,
      coverUrl: fd.get('coverUrl')?.toString().trim() || null,
    };

    if (!payload.name) return setErr('Nama aktivitas wajib diisi.');
    if (!payload.date) return setErr('Tanggal wajib diisi.');
    if (payload.quota !== null && (isNaN(payload.quota) || payload.quota < 0)) {
      return setErr('Kuota harus angka ≥ 0.');
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Gagal menyimpan perubahan.');
      }
      setOk('Perubahan disimpan.');
      setTimeout(() => router.push(`/activities/${activityId}`), 250);
    } catch (e) {
      setErr(e.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  if (!data && !err) {
    return (
      <div className='rounded-xl bg-white p-4 text-sm text-slate-600'>
        Memuat data...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className='mt-4 rounded-xl bg-white p-4'>
      <h3 className='text-lg font-semibold text-slate-900'>Edit Aktivitas</h3>
      <p className='mt-1 text-sm text-slate-600'>
        Perbarui informasi aktivitas di bawah ini.
      </p>

      {/* hidden fields (ikuti permintaan: sembunyikan orgId & status) */}
      <input
        type='hidden'
        name='organizationId'
        defaultValue={data?.organizationId ?? ''}
      />
      <input
        type='hidden'
        name='status'
        defaultValue={data?.status ?? 'DRAFT'}
      />

      <div className='mt-4 grid gap-3 md:grid-cols-2'>
        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-slate-700'>
            Nama Aktivitas *
          </label>
          <input
            name='name'
            defaultValue={data?.name ?? ''}
            required
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Tanggal & Waktu *
          </label>
          <input
            type='datetime-local'
            name='date'
            defaultValue={dateDefault}
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
            defaultValue={data?.description ?? ''}
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Syarat Relawan
          </label>
          <textarea
            name='volunteerRequirement'
            rows={2}
            defaultValue={data?.volunteerRequirement ?? ''}
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
            defaultValue={data?.donationInstruction ?? ''}
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Lokasi
          </label>
          <input
            name='location'
            defaultValue={data?.location ?? ''}
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Alamat/lokasi kegiatan'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Kuota
          </label>
          <input
            type='number'
            name='quota'
            min='0'
            defaultValue={data?.quota ?? ''}
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
            defaultValue={data?.coverUrl ?? ''}
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
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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
