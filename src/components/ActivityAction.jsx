'use client';

import { useRouter } from 'next/navigation';

export default function ActivityAction({ activityId }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/activities/${activityId}/edit`);
  };

  const handleCancel = async () => {
    const ok = confirm('Yakin ingin membatalkan aktivitas ini?');
    if (!ok) return;

    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Aktivitas berhasil dibatalkan.');
        router.back();
      } else {
        const err = await res.json();
        alert(err.error || 'Gagal membatalkan aktivitas.');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div className='flex gap-3 mt-4'>
      <button
        onClick={handleEdit}
        className='rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-blue-500'
      >
        Perbaharui Data
      </button>

      <button
        type='button'
        onClick={handleCancel}
        className='rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300'
      >
        Batalkan Kegiatan
      </button>
    </div>
  );
}
