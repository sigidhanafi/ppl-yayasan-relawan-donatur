import React from 'react';
import SideBar from '@/components/SideBar';

export default function DashboardPage() {
  return (
    <div className='flex min-h-screen bg-slate-50'>
      {/* SideBar */}
      <SideBar />

      {/* Main Content */}
      <main className='flex-1 p-8 overflow-y-auto'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900'>Dashboard</h1>
          <p className='mt-2 text-slate-600'>Selamat datang di halaman dashboard Anda. Pilih menu di samping untuk navigasi.</p>

          <div className='mt-8 p-6 bg-white rounded-lg shadow'>
            <h2 className='text-xl font-semibold text-slate-800'>Ringkasan Kegiatan</h2>
            <p className='mt-2 text-slate-500'>
              Di sini Anda dapat melihat ringkasan singkat dari kegiatan terbaru atau informasi penting lainnya.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
