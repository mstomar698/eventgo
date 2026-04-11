import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import { requireEnvVar, requireFirstEnvVar } from '@/lib/env';

const googleClientId = requireFirstEnvVar('GOOGLE_ID', 'GOOGLE_CLIENT_ID');
const googleClientSecret = requireFirstEnvVar('GOOGLE_SECRET', 'GOOGLE_CLIENT_SECRET');

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  secret: requireEnvVar('NEXTAUTH_SECRET'),
  pages: {
    signIn: '/home',
  },
};

export default NextAuth(authOptions);
