'use client';
import { useState } from 'react';
import VolunteerForm from '@/components/VolunteerForm';
import SignInButton from '@/components/SignInButton';

export default function RelawanCard({ act, isPast, params, session }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className='mt-6 rounded-sm border border-slate-200 bg-white p-4'>
      <h3 className='text-lg font-semibold text-slate-900'>Kuota Relawan</h3>
      <p className='mt-2 text-slate-700 font-bold'>
        {act.quota} relawan dibutuhkan ({act._count.volunteers} pendaftar)
      </p>
      <p className='text-sm text-slate-500'>
        {act.quota > 0
          ? 'Masih tersedia slot untuk mendaftar.'
          : 'Kuota sudah penuh.'}
      </p>

      {showForm && (
        <div id='daftar-relawan' className='mt-6'>
          <VolunteerForm
            activityId={act.id}
            isDisabled={isPast || act.quota === 0}
            onClose={() => setShowForm(false)}
            session={session}
          />
        </div>
      )}

      {!showForm && (
        <>
          {session && session.user && (
            <button
              onClick={() => setShowForm((v) => !v)}
              disabled={isPast || act.quota === 0}
              className={`mt-4 w-full rounded-lg px-4 py-2 font-medium text-white ${
                isPast || act.quota === 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isPast
                ? 'Kegiatan Selesai'
                : act.quota === 0
                ? 'Kuota Penuh'
                : 'Daftar Sebagai Relawan'}
            </button>
          )}
        </>
      )}

      {/* {session && session.user && (
        <div id='daftar-relawan' className='mt-6'>
          <VolunteerForm
            activityId={act.id}
            isDisabled={isPast || act.quota === 0}
            onClose={() => setShowForm(false)}
            session={session}
          />
        </div>
      )} */}

      {!session && (
        <SignInButton
          buttonTitle={'Login dan Daftar sebagai Relawan'}
          callbackUrl={`/activities/${act.id}`}
        />
      )}
    </div>
  );
}
