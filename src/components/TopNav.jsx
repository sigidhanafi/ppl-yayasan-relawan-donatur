'use client';

import { useState, useMemo, use } from 'react';
import { CircleUser } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TopNav({ user }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // helper: cocokkan persis dengan route
  const isActive = (href) => {
    const norm = (p) => (p !== '/' ? p.replace(/\/+$/, '') : '/');
    // return norm(pathname) === norm(href);
    // kalau mau aktif juga di sub-route:
    return (
      norm(pathname) === norm(href) ||
      norm(pathname).startsWith(norm(href) + '/')
    );
  };

  const links = useMemo(
    () => [
      { href: '/', label: 'Semua Kegiatan', show: true },
      {
        href: '/dashboard',
        label: 'Organisasi',
        show: user && user.role === 'ORGANISASI',
      },
      {
        href: '/activities',
        label: 'Kegiatan',
        show: true,
        show: user && user.role === 'ORGANISASI',
      },
      {
        href: '/notifications',
        label: 'Notifikasi',
        show: user,
      },
    ],
    [user]
  );

  return (
    <header className='sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200'>
      <div className='mx-auto max-w-6xl px-4 h-14 flex items-center justify-between'>
        <nav className='flex items-center'>
          {links
            .filter((l) => l.show)
            .map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'px-6 py-4 font-medium transition-colors',
                    active
                      ? 'text-slate-900 bg-cyan-200'
                      : 'text-slate-600 hover:bg-cyan-200 hover:text-slate-900'
                  )}
                >
                  {label}
                </Link>
              );
            })}
        </nav>

        {!user && (
          <div className='relative'>
            <Link
              href={'/auth'}
              className={
                'px-6 py-5 font-medium transition-colors text-slate-900 hover:bg-cyan-200 hover:text-slate-900'
              }
            >
              Login
            </Link>
          </div>
        )}

        {user && (
          <div className='relative'>
            <button
              onClick={() => setOpen((v) => !v)}
              className='inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 hover:bg-slate-100'
              title={user.name || 'Profil'}
              aria-expanded={open}
              aria-haspopup='menu'
            >
              <span className='truncate max-w-[160px]'>{user.name}</span>
              <CircleUser className='h-6 w-6' />
            </button>

            {open && (
              <div
                role='menu'
                className='absolute right-0 mt-2 w-40 rounded-md border border-slate-200 bg-white shadow-md'
              >
                <button
                  role='menuitem'
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className='w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer'
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
