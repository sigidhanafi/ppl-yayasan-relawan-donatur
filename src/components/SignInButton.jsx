'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignInButton({ buttonTitle, callbackUrl }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleClick = async () => {
    try {
      setLoading(true);
      setMsg('');

      // redirect:false supaya kita bisa lihat hasilnya
      const res = await signIn('google', {
        callbackUrl,
        redirect: false,
      });

      if (res?.error) {
        setMsg(`Gagal login: ${res.error}`);
        return;
      }
      if (res?.url) {
        // manual redirect (lebih eksplisit, dan bisa di-log)
        window.location.href = res.url;
        return;
      }
      setMsg('Tidak ada URL callback dari NextAuth.');
    } catch (e) {
      console.error(e);
      setMsg(`Terjadi error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      variant='default'
      className='mt-4 rounded-lg px-4 py-2 font-medium text-white bg-sky-600 hover:bg-sky-700'
    >
      {buttonTitle ? buttonTitle : 'Masuk dengan Google'}
    </button>
  );
}
