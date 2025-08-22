// middleware.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(req) {
  const session = await getSession();
  const url = new URL(req.url);

  if (!session?.user) {
    // Tambahkan callbackUrl ke halaman auth
    const authUrl = new URL('/auth', url.origin);
    authUrl.searchParams.set('callbackUrl', url.pathname + url.search);
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}
