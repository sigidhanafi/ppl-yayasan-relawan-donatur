'use client';

import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/profile', label: 'Profil' },
  { href: '/activities', label: 'Kegiatan' },
];

const adminNavItems = [
  { href: '/dashboard/manage-activities', label: 'Kelola Kegiatan' },
  { href: '/dashboard/manage-users', label: 'Kelola User' },
];

export default function SideBar() {
  // Gunakan state ini untuk mensimulasikan status admin.
  // Di aplikasi nyata, Anda akan mendapatkan status ini dari autentikasi pengguna.
  const [isAdmin, setIsAdmin] = useState(true);

  const handleLogout = () => {
    // Logika logout di sini
    console.log('User logged out.');
  };

  return (
    <aside className='w-64 bg-slate-900 text-white p-6 flex flex-col'>
      {/* Logo atau Nama Aplikasi */}
      <div className='text-2xl font-bold text-sky-400 mb-8'>
        Aplikasi Yayasan
      </div>

      {/* Navigasi Utama */}
      <nav className='flex-1'>
        <ul className='space-y-2'>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className='block py-2 px-4 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors'
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Navigasi Khusus Admin */}
          {isAdmin && (
            <>
              <div className='border-t border-slate-700 my-4' />
              {adminNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className='block py-2 px-4 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors'
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>

      {/* Tombol Logout */}
      <div className='mt-auto pt-4'>
        <button
          onClick={handleLogout}
          className='w-full text-left py-2 px-4 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors'
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
