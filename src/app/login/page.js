// app/login/page.js
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className='bg-white'>
      <section className='mx-auto max-w-sm px-4 py-10'>
        <h1 className='text-3xl font-bold text-center text-slate-900'>Masuk Akun</h1>
        <p className='mt-2 text-center text-slate-600'>
          Masuk untuk mengakses dashboard dan bergabung dengan kegiatan.
        </p>

        <LoginForm />

        <div className='mt-4 text-center text-sm text-slate-600'>
          Belum punya akun?{' '}
          <Link href='/register' className='text-sky-600 hover:underline'>
            Daftar Sekarang
          </Link>
        </div>
      </section>
    </main>
  );
}
