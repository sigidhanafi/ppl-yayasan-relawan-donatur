'use client';

import { useState } from 'react';
import { CircleUser } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function TopNav({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <header className='sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200'>
      <div className='mx-auto max-w-6xl px-4 h-14 flex items-center justify-between'>
        <nav className='flex items-center gap-2 text-sm'>
          <a
            href='/'
            className='rounded-md px-3 py-2 font-medium text-slate-900 bg-slate-100'
          >
            Home
          </a>
          {user && (
            <a
              href='/dashboard'
              className='rounded-md px-3 py-2 font-medium text-slate-900 bg-slate-100'
            >
              Dashboard
            </a>
          )}
          <a
            href='/activities'
            className='rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          >
            Aktivitas
          </a>
          <a
            href='/notifications'
            className='rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          >
            Notifikasi
          </a>
        </nav>

        {user && (
          <div className='relative'>
            <button
              onClick={() => setOpen(!open)}
              className='inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 hover:bg-slate-100'
              title={user?.name || 'Profil'}
            >
              <CircleUser className='h-6 w-6' />
            </button>

            {open && (
              <div className='absolute right-0 mt-2 w-40 rounded-md border border-slate-200 bg-white shadow-md'>
                <a
                  href='/profile'
                  className='block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50'
                >
                  Profil
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className='w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
