'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterForm({ onSuccess }) {
  const [role, setRole] = useState('user'); // "user" | "owner"
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
    if (f.size > 5 * 1024 * 1024) {
      e.target.value = '';
      setErr('Ukuran file maksimal 5 MB.');
      setPreview(null);
      return;
    }
    setErr(null);
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setOk(null);
    setErr(null);

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const password = String(fd.get('password') || '');
    const confirm = String(fd.get('confirm') || '');
    const kind = String(fd.get('role') || 'user');

    if (!name || !email || !phone || !password) {
      setErr('Nama, email, nomor HP, dan password wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setErr('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirm) {
      setErr('Konfirmasi password tidak cocok.');
      return;
    }

    if (kind === 'owner') {
      const orgName = String(fd.get('orgName') || '').trim();
      const bankName = String(fd.get('bankName') || '').trim();
      const bankAccount = String(fd.get('bankAccount') || '').trim();
      const orgDoc = fd.get('orgDoc');
      if (!orgName || !bankName || !bankAccount) {
        setErr('Nama yayasan, bank, dan nomor rekening wajib diisi.');
        return;
      }
      if (!(orgDoc instanceof File) || !orgDoc.name) {
        setErr('Mohon unggah dokumen legal yayasan (gambar/PDF).');
        return;
      }
      if (orgDoc.size > 5 * 1024 * 1024) {
        setErr('Ukuran file maksimal 5 MB.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || 'Gagal mendaftar.');
      }
      const j = await res.json();
      setOk('Pendaftaran berhasil! Kamu bisa login sekarang.');
      e.currentTarget.reset();
      setPreview(null);
      if (onSuccess) onSuccess(j);
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
            Nama Lengkap *
          </label>
          <input
            name='name'
            className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            placeholder='Mis. Rina Putri'
            required
          />
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-slate-700'>
              Email *
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
              No. HP/WhatsApp *
            </label>
            <input
              type='tel'
              name='phone'
              className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
              placeholder='08xxxxxxxxxx'
              required
            />
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-slate-700'>
              Password *
            </label>
            <input
              type='password'
              name='password'
              minLength={6}
              className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700'>
              Konfirmasi Password *
            </label>
            <input
              type='password'
              name='confirm'
              minLength={6}
              className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
              required
            />
          </div>
        </div>

        {/* Role selector */}
        <div>
          <label className='block text-sm font-medium text-slate-700'>
            Tipe Akun *
          </label>
          <div className='mt-2 flex items-center gap-4'>
            <label className='inline-flex items-center gap-2'>
              <input
                type='radio'
                name='role'
                value='owner'
                checked={role === 'owner'}
                onChange={() => setRole('owner')}
              />
              <span>Pengelola Yayasan</span>
            </label>
            <label className='inline-flex items-center gap-2'>
              <input
                type='radio'
                name='role'
                value='user'
                checked={role === 'user'}
                onChange={() => setRole('user')}
              />
              <span>Relawan atau Donatur</span>
            </label>
          </div>
        </div>

        {/* Bagian Yayasan */}
        {role === 'owner' && (
          <div className='rounded-lg py-4'>
            <h2 className='text-base font-semibold text-slate-900'>
              Data Yayasan
            </h2>
            <div className='mt-3 grid gap-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700'>
                  Nama Yayasan *
                </label>
                <input
                  name='orgName'
                  className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
                  placeholder='Mis. Yayasan Cemerlang Nusantara'
                  required
                />
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='block text-sm font-medium text-slate-700'>
                    Alamat Yayasan
                  </label>
                  <input
                    name='orgAddress'
                    className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
                    placeholder='Jl. Contoh No. 123, Kota'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700'>
                    NPWP (opsional)
                  </label>
                  <input
                    name='orgNpwp'
                    className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
                    placeholder='99.999.999.9-999.999'
                  />
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='block text-sm font-medium text-slate-700'>
                    Bank *
                  </label>
                  <input
                    name='bankName'
                    className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
                    placeholder='BCA / BRI / Mandiri / dll.'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700'>
                    No. Rekening *
                  </label>
                  <input
                    name='bankAccount'
                    className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
                    placeholder='1234567890'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700'>
                  Dokumen Legal (gambar/PDF, maks 5 MB) *
                </label>
                <input
                  type='file'
                  name='orgDoc'
                  accept='image/*,application/pdf'
                  onChange={onFileChange}
                  required
                  className='mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:font-medium file:text-white hover:file:bg-sky-700'
                />
                {preview && (
                  <img
                    src={preview}
                    alt='Preview dokumen'
                    className='mt-2 h-40 w-auto rounded-md border object-contain'
                  />
                )}
              </div>
            </div>
          </div>
        )}

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
          {loading ? 'Memproses...' : 'Daftar'}
        </button>

        <p className='text-sm text-slate-600'>
          Sudah punya akun?{' '}
          <Link href='/login' className='text-sky-600 hover:underline'>
            Masuk
          </Link>
        </p>
      </div>
    </form>
  );
}
