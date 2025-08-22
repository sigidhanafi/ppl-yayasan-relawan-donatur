import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // default v4 adalah 'jwt'; jika kamu ingin pakai tabel Session Prisma, ubah:
  session: { strategy: 'database' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.address = user.address ?? null;
      }
      return session;
    },
  },
};

// Helper agar mudah dipakai di server components / server actions
export function getSession() {
  return getServerSession(authOptions);
}

// Handler untuk route.js
// export const authHandler = NextAuth(authOptions);
