'use client';

import { useState } from 'react';

export default function DonationForm({ activityId, onClose, isDisabled }) {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);
  const [preview, setPreview] = useState(null);

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) {
      setPreview(null);
      return;
    }
    // batas ukuran 5MB
    if (f.size > 5 * 1024 * 1024) {
      e.target.value = '';
      setErr('Ukuran file maksimal 5 MB.');
      setPreview(null);
      return;
    }
    setErr(null);
    // preview hanya untuk image
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setOk(null);
    setErr(null);
    if (isDisabled) return;

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const amount = Number(fd.get('amount') || 0);
    if (!amount || amount <= 0) {
      setErr('Nominal donasi harus lebih dari 0.');
      return;
    }
    const proof = fd.get('proof');
    if (!(proof instanceof File) || !proof.name) {
      setErr('Mohon unggah bukti transfer.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/activities/${activityId}/donate`, {
        method: 'POST',
        body: fd, // multipart/form-data otomatis
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || 'Gagal mengirim donasi.');
      }
      setOk('Terima kasih! Donasi kamu telah diterima. 🙏');
      formEl.reset();
      setPreview(null);
      // opsional: tutup form setelah sukses
      // onClose?.();
    } catch (e) {
      setErr(e.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className='mt-4 rounded-xl bg-white p-4'>
      <h3 className='text-lg font-semibold text-slate-900'>Form Donasi</h3>
      <p className='mt-1 text-sm text-slate-600'>
        Isi data berikut dan unggah bukti transfer. Berkas yang didukung: JPG,
        PNG, PDF (maks 5 MB).
      </p>

      <div className='mt-4 grid gap-3 md:grid-cols-2'>
        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Nama Lengkap
          </label>
          <input
            name='name'
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Mis. Andi Pratama'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Email
          </label>
          <input
            type='email'
            name='email'
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='nama@email.com'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Nominal Donasi (Rp) *
          </label>
          <input
            type='number'
            name='amount'
            min='1000'
            step='1000'
            required
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Contoh: 100000'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Metode
          </label>
          <select
            name='method'
            defaultValue='transfer'
            className='mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-sky-500 focus:outline-none'
          >
            <option value='transfer'>Transfer Bank</option>
            <option value='qris'>QRIS</option>
            <option value='ewallet'>E-Wallet</option>
          </select>
        </div>

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-slate-700'>
            Catatan
          </label>
          <textarea
            name='notes'
            rows={3}
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Kesan/pesan khusus untuk panitia (opsional)'
          />
        </div>

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-slate-700'>
            Bukti Transfer *
          </label>
          <input
            type='file'
            name='proof'
            accept='image/*,application/pdf'
            required
            onChange={onFileChange}
            className='mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:font-medium file:text-white hover:file:bg-sky-700'
          />
          {preview && (
            <img
              src={preview}
              alt='Preview bukti transfer'
              className='mt-2 h-40 w-auto rounded-md border object-contain'
            />
          )}
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
          disabled={loading || isDisabled}
          className={`rounded-lg px-4 py-2 font-medium text-white ${
            loading || isDisabled
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-700'
          }`}
        >
          {loading ? 'Mengirim...' : 'Kirim Donasi'}
        </button>
        <button
          type='button'
          onClick={onClose}
          className='rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300'
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
