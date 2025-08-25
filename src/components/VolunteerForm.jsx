'use client';

import { useState } from 'react';

export default function VolunteerForm({
  activityId,
  isDisabled,
  onClose,
  session,
}) {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);
  const [botField, setBotField] = useState(''); // honeypot

  async function onSubmit(e) {
    e.preventDefault();
    setOk(null);
    setErr(null);

    if (botField) {
      setErr('Terjadi kesalahan.');
      return;
    }

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      availability: String(form.get('availability') || ''),
      skills: String(form.get('skills') || ''),
      notes: String(form.get('notes') || ''),
      agree: form.get('agree') === 'on',
    };

    if (!payload.name || !payload.email || !payload.phone) {
      setErr('Nama, email, dan nomor HP wajib diisi.');
      return;
    }
    if (!payload.agree) {
      setErr('Kamu harus menyetujui ketentuan relawan.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/activities/${activityId}/volunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || 'Gagal mengirim formulir.');
      }
      setOk(
        'Terima kasih! Pendaftaran kamu sudah kami terima. Silahkan tunggu approval dari Yayasan.'
      );
      // e.currentTarget.reset();
    } catch (e) {
      setErr(e.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className='mt-4 bg-white p-4 border-t-1 border-gray-200'
    >
      <h3 className='text-lg font-semibold text-slate-900'>
        Konfirmasi Data Relawan
      </h3>

      <div className='mt-4 grid gap-3 md:grid-cols-2'>
        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Nama Lengkap *
          </label>
          <input
            name='name'
            required
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Mis. Dina Lestari'
            defaultValue={session.user.name}
            readOnly
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Email *
          </label>
          <input
            type='email'
            name='email'
            required
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='nama@email.com'
            defaultValue={session.user.email}
            readOnly
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-slate-700'>
            No. HP/WhatsApp *
          </label>
          <input
            type='tel'
            name='phone'
            required
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='08xxxxxxxxxx'
            defaultValue={session.user.phone}
          />
        </div>
        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-slate-700'>
            Catatan Tambahan
          </label>
          <textarea
            name='notes'
            rows={3}
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Tulis hal yang perlu kami ketahui (alergi, transport, dll.)'
          />
        </div>
      </div>

      <label className='mt-4 inline-flex items-start gap-2 text-sm text-slate-700'>
        <input type='checkbox' name='agree' className='mt-1' />
        <span>
          Saya menyetujui ketentuan relawan dan kebijakan privasi, serta
          bersedia dihubungi panitia.
        </span>
      </label>

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

      <div className='space-x-2'>
        <button
          type='submit'
          disabled={loading || isDisabled}
          className={`mt-4 inline-flex items-center rounded-lg px-4 py-2 font-medium text-white ${
            loading || isDisabled
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {loading ? 'Mengirim...' : 'Daftar'}
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
