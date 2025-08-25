import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function ActivityCreateCard() {
  return (
    <Link
      href='/activities/create'
      className='group flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 transition'
    >
      <div className='mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600 group-hover:bg-sky-200'>
        <Plus className='h-8 w-8' />
      </div>
      <h3 className='text-base font-medium'>Buat Aktivitas Baru</h3>
      <p className='mt-1 text-xs text-slate-500'>
        Klik untuk menambahkan kegiatan
      </p>
    </Link>
  );
}
