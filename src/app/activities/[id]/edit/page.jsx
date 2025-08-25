import { getSession } from '@/lib/auth';
import ActivityEditForm from '@/components/ActivityEditForm';
import TopNav from '@/components/TopNav';

async function getActivity(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activities/${id}`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function EditActivityPage({ params }) {
  const { id: activityId } = await params;
  const initialData = await getActivity(activityId);
  const session = await getSession();

  return (
    <main className='min-h-screen bg-white text-slate-900'>
      {/* Top Nav */}
      <TopNav user={session && session.user} />

      <section className='bg-gradient-to-b from-sky-50 to-white'>
        <div className='mx-auto max-w-6xl px-4 pt-12'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900'>
            Edit Aktivitas
          </h1>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 pb-16'>
        <ActivityEditForm
          activityId={activityId}
          initialData={initialData || undefined}
        />
      </section>
    </main>
  );
}
