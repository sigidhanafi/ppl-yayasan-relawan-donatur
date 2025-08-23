import Link from 'next/link';

export default function ActivityCard({ a }) {
  const d = new Date(a.date);
  const isPast = d < new Date();

  return (
    <div className='group rounded-md border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition'>
      {a.coverUrl ? (
        <img
          src={a.coverUrl}
          alt={a.title}
          className='mb-3 h-40 w-full rounded-md object-cover'
        />
      ) : (
        <div className='mb-3 grid h-40 w-full place-items-center rounded-xl bg-slate-100 text-sm text-slate-500'>
          Tidak ada gambar
        </div>
      )}

      {/* <div className='flex items-center gap-2 text-xs'>
        <span className='inline-flex items-center rounded-md bg-sky-100 px-2 py-0.5 font-medium text-sky-700'>
          {a.category}
        </span>
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ${
            isPast ? 'bg-slate-100 text-slate-600' : 'bg-sky-50 text-sky-700'
          }`}
        >
          {isPast ? 'Selesai' : 'Akan datang'}
        </span>
      </div> */}

      <h3 className='mt-2 text-lg font-semibold leading-tight text-slate-900'>
        {a.name}
      </h3>
      <p className='mt-1 line-clamp-2 text-sm text-slate-700'>
        {a.description ?? '—'}
      </p>

      <div className='mt-3 grid grid-cols-2 gap-2 text-xs text-slate-700'>
        <div>📍 {a.location}</div>
        <div>🗓️ {d.toLocaleDateString()}</div>
        {typeof a.slots === 'number' && <div>👥 Kuota: {a.slots}</div>}
      </div>

      <div className='mt-4'>
        <Link
          href={`/activities/${a.id}`}
          className='inline-flex items-center rounded-md bg-sky-500 px-4 py-2 font-medium text-white hover:bg-sky-600'
        >
          Lihat detail
        </Link>
      </div>
    </div>
  );
}
