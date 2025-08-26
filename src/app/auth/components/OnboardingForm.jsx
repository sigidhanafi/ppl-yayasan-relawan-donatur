'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OnboardingForm({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const [preview, setPreview] = useState(null);

  const [choice, setChoice] = useState('RELAWAN'); // 'RELAWAN' | 'OWNER'
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    orgName: '',
    orgDescription: '',
    orgAddress: '',
    orgDoc: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  }

  function handleFile(e) {
    const { name, files } = e.target;
    if (!files || !files.length) return;
    const file = files[0];
    setProfile((p) => ({ ...p, [name]: file }));
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleSave() {
    setErr(null);
    setOk(null);

    if (
      !profile.name.trim() ||
      !profile.phone.trim() ||
      !profile.address.trim()
    ) {
      setErr('Nama, nomor HP dan alamat wajib diisi.');
      return;
    }

    if (choice === 'OWNER') {
      if (!profile.orgName.trim() || !profile.orgAddress.trim()) {
        setErr('Nama yayasan dan alamat yayasan wajib diisi.');
        return;
      }

      if (profile.orgDoc && profile.orgDoc.size > 5 * 1024 * 1024) {
        setErr('Ukuran file maksimal 5 MB.');
        return;
      }
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('choice', choice);
      fd.append('name', profile.name);
      fd.append('phone', profile.phone);
      fd.append('address', profile.address);
      if (choice === 'OWNER') {
        fd.append('orgName', profile.orgName);
        fd.append('orgAddress', profile.orgAddress);
        if (profile.orgDescription)
          fd.append('orgDescription', profile.orgDescription);
        if (profile.orgDoc) fd.append('orgDoc', profile.orgDoc);
      }

      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || 'Gagal menyimpan data.');
      }

      setOk('Data berhasil disimpan.');
      if (choice === 'OWNER') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (e) {
      setErr(e.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='grid gap-4 bg-white p-4 rounded-md shadow'>
      <h2 className='text-lg font-semibold'>Data Profil & Yayasan</h2>

      {/* Pilihan peran */}
      <div>
        <label className='block text-sm font-medium text-slate-700 mb-1'>
          Masuk sebagai
        </label>
        <div className='flex gap-3'>
          <label className='flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer'>
            <input
              type='radio'
              name='choice'
              value='RELAWAN'
              checked={choice === 'RELAWAN'}
              onChange={() => setChoice('RELAWAN')}
              disabled={loading}
            />
            <span>Relawan</span>
          </label>
          <label className='flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer'>
            <input
              type='radio'
              name='choice'
              value='OWNER'
              checked={choice === 'OWNER'}
              onChange={() => setChoice('OWNER')}
              disabled={loading}
            />
            <span>Pemilik Yayasan</span>
          </label>
        </div>
        <p className='mt-2 text-xs text-slate-500'>
          Relawan: langsung bisa mengikuti kegiatan. Pemilik Yayasan: isi detail
          organisasi untuk verifikasi.
        </p>
      </div>

      {/* Data Profil */}
      <h3 className='text-base font-semibold mt-2'>Data Profil</h3>
      <div>
        <label className='block text-sm font-medium text-slate-700'>
          Nama Lengkap *
        </label>
        <input
          name='name'
          value={profile.name}
          onChange={handleChange}
          placeholder='Nama Lengkap'
          required
          disabled={loading}
          className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-slate-700'>
          Nomor HP *
        </label>
        <input
          name='phone'
          value={profile.phone}
          onChange={handleChange}
          placeholder='08xxxxxxxxxx'
          required
          disabled={loading}
          className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-slate-700'>
          Alamat *
        </label>
        <input
          name='address'
          value={profile.address}
          onChange={handleChange}
          placeholder='Alamat'
          required
          disabled={loading}
          className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
        />
      </div>

      {/* Data Organisasi (muncul hanya jika OWNER) */}
      {choice === 'OWNER' && (
        <>
          <h3 className='text-base font-semibold mt-6'>Data Yayasan</h3>

          <div>
            <label className='block text-sm font-medium text-slate-700'>
              Nama Yayasan *
            </label>
            <input
              name='orgName'
              value={profile.orgName}
              onChange={handleChange}
              placeholder='Mis. Yayasan Cemerlang Nusantara'
              disabled={loading}
              className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700'>
              Alamat Yayasan *
            </label>
            <input
              name='orgAddress'
              value={profile.orgAddress}
              onChange={handleChange}
              placeholder='Jl. Contoh No. 123, Kota'
              disabled={loading}
              className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700'>
              Deskripsi Singkat (opsional)
            </label>
            <textarea
              name='orgDescription'
              value={profile.orgDescription}
              onChange={handleChange}
              placeholder='Ceritakan fokus dan program yayasan secara singkat.'
              disabled={loading}
              rows={3}
              className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700'>
              Dokumen Legal (gambar/PDF, maks 5 MB) — opsional
            </label>
            <input
              type='file'
              name='orgDoc'
              accept='image/*,application/pdf'
              onChange={handleFile}
              disabled={loading}
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
        </>
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

      <div className='flex items-center justify-end gap-3'>
        <button
          type='button'
          onClick={handleSave}
          disabled={loading}
          className={`rounded-md px-4 py-2 font-medium text-white ${
            loading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-700'
          }`}
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  );
}
