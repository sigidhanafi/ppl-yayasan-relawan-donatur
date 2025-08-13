// app/register/page.js
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <main className='bg-white'>
      <section className='mx-auto max-w-2xl px-4 py-10'>
        <h1 className='text-3xl font-bold text-slate-900'>Daftar Akun</h1>
        <p className='mt-2 text-slate-600'>
          Buat akun pengguna. Jika kamu pemilik yayasan, pilih “User + Yayasan”.
        </p>

        {/* @ts-expect-error fine in JS projects */}
        <RegisterForm />
      </section>
    </main>
  );
}
