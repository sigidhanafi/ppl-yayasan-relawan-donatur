import { getSession } from '@/lib/auth';

import TopNav from '@/components/TopNav';
import NotificationList from '@/components/NotificationList';

// async function getNotifications(id) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`,
//     { cache: 'no-store' } // selalu fresh
//   );
//   if (!res.ok) {
//     // bisa lempar error / return null
//     return null;
//   }

//   return res.json();
// }

export const revalidate = 0; // always fetch fresh data (disable caching)

export default async function Page() {
  const session = await getSession();
  if (!session?.user) redirect('/auth');

  // const notifications = await getNotifications();

  return (
    <main className='min-h-screen bg-white text-slate-900'>
      {/* Top Nav */}
      <TopNav user={session.user} />

      {/* Hero */}
      <section className=''>
        <div className='mx-auto max-w-6xl px-4 py-10'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
            Notifikasi
          </h1>
          <p className='mt-3 text-slate-700'></p>
        </div>
      </section>

      <section>
        <div className='mx-auto max-w-6xl px-4 py-10'>
          <NotificationList />
        </div>
      </section>
    </main>
  );
}
