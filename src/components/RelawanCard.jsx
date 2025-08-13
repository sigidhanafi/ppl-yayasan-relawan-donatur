'use client';
import { useState } from 'react';
import VolunteerForm from '@/components/VolunteerForm';

export default function RelawanCard({ act, isPast, params }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className='mt-6 rounded-sm border border-slate-200 bg-white p-4'>
      <h3 className='text-lg font-semibold text-slate-900'>Kuota Relawan</h3>
      <p className='mt-2 text-slate-700'>👥 {act.slots} relawan dibutuhkan</p>
      <p className='text-sm text-slate-500'>
        {act.slots > 0
          ? 'Masih tersedia slot untuk mendaftar.'
          : 'Kuota sudah penuh.'}
      </p>

      {showForm && (
        <div id='daftar-relawan' className='mt-6'>
          <VolunteerForm
            activityId={params.id}
            isDisabled={isPast || act.slots === 0}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm((v) => !v)}
          disabled={isPast || act.slots === 0}
          className={`mt-4 w-full rounded-lg px-4 py-2 font-medium text-white ${
            isPast || act.slots === 0
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isPast
            ? 'Kegiatan Selesai'
            : act.slots === 0
            ? 'Kuota Penuh'
            : 'Daftar Sebagai Relawan'}
        </button>
      )}
    </div>
  );
}
