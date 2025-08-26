'use client';

import { useState } from 'react';
import DonationForm from '@/components/DonationForm';

export default function DonationCard({ act, isPast, activityId }) {
  const [showForm, setShowForm] = useState(false);

  const pct =
    typeof act.donation_target === 'number' && act.donation_target > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round((act.donation_collected / act.donation_target) * 100)
          )
        )
      : null;

  return (
    <div className='mt-6 rounded-sm border border-slate-200 bg-white p-4'>
      <h3 className='text-lg font-semibold text-slate-900'>Dukungan Donasi</h3>

      <div className='mt-2 flex items-baseline justify-between'>
        <div className='text-slate-700'>
          Donasi Terkumpul: Rp {act.donationAmount.toLocaleString('id-ID')}
          {/* {typeof act.donation_target === 'number' && (
            <> / Rp {act.donation_target.toLocaleString('id-ID')}</>
          )} */}
        </div>
        {/* {typeof pct === 'number' && (
          <span className='text-sm text-slate-600'>{pct}%</span>
        )} */}
      </div>

      {typeof pct === 'number' && (
        <div
          className='mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200'
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div
            className={`h-full ${
              pct < 40
                ? 'bg-rose-500'
                : pct < 70
                ? 'bg-amber-500'
                : 'bg-emerald-600'
            } transition-[width] duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          disabled={isPast}
          className={`mt-4 rounded-lg px-4 py-2 font-medium text-white ${
            isPast
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-700'
          }`}
        >
          {isPast ? 'Kegiatan Selesai' : 'Berdonasi Sekarang'}
        </button>
      ) : (
        <DonationForm
          activityId={activityId}
          isDisabled={isPast}
          onClose={() => setShowForm(false)} // tombol "Tutup Form" ada di dalam DonationForm
        />
      )}
    </div>
  );
}
