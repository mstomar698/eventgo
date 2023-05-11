'use client';
import { cokkieProvider } from '@/lib/user';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
  const userInfo = cokkieProvider();

  const router = useRouter();

  if (!userInfo) {
    if (typeof window !== 'undefined') {
      router.push('/auth');
    }
    return null;
  }

  return (
    <>
      Planner
      <h1>{userInfo.name}</h1>
    </>
  );
};

export default Page;
