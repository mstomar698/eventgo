import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import { getEnvVar, requireEnvVar } from '@/lib/env';

const providers = [];

const githubId = getEnvVar('GITHUB_ID');
const githubSecret = getEnvVar('GITHUB_SECRET');
if (githubId && githubSecret) {
  providers.push(
    GithubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
    })
  );
}

const googleId = getEnvVar('GOOGLE_ID');
const googleSecret = getEnvVar('GOOGLE_SECRET');
if (googleId && googleSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleId,
      clientSecret: googleSecret,
    })
  );
}

if (providers.length === 0) {
  throw new Error(
    'At least one auth provider must be configured (GITHUB_* or GOOGLE_* env vars).'
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: requireEnvVar('NEXTAUTH_SECRET'),
};

export default NextAuth(authOptions);
