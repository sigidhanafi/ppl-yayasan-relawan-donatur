// components/LoginForm.jsx
'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setOk(null);
    setErr(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '');

    if (!email || !password) {
      setErr('Email dan password wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      // Mengirim data ke API rute /api/auth/login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
      }

      const j = await res.json();
      setOk('Berhasil masuk! Mengarahkan ke dashboard...');
      console.log('Login berhasil, token:', j.token);

      // TODO: Simpan token di localStorage atau cookies dan arahkan ke dashboard
      // window.location.href = '/dashboard';

    } catch (e) {
      setErr(e.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className='mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'
    >
      <div className='grid gap-4'>
        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Email
          </label>
          <input
            type='email'
            name='email'
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='nama@email.com'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Password
          </label>
          <input
            type='password'
            name='password'
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            required
          />
        </div>

        {err && (
          <div className='rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700'>
            {err}
          </div>
        )}
        {ok && (
          <div className='rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>
            {ok}
          </div>
        )}

        <button
          type='submit'
          disabled={loading}
          className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-white ${
            loading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-700'
          }`}
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </div>
    </form>
  );
}
