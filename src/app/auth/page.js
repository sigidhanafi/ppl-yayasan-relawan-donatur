import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignInButton from './components/SignInButton';

export default async function RegisterPage() {
  const session = await getSession();

  if (session && session?.user) {
    redirect('/auth/route-decider');
  }

  return (
    <main style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
      <h1>Daftar Pengelola Yayasan</h1>
      <p>Masuk dengan Google untuk memulai.</p>
      <SignInButton />
    </main>
  );
}
