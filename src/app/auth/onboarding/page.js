import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import OnboardingForm from '../components/OnboardingForm';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/auth'); // kalau belum login, balik ke login
  }

  return (
    <main className='max-w-2xl mx-auto p-6'>
      <OnboardingForm user={session.user} />
    </main>
  );
}
