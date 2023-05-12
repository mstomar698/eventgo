'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { cokkieProvider } from '@/lib/user';
import { Footer, Navbar, Notes } from '@/components';

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
      <div className="relative z-0 bg-primary overflow-hidden">
        <Navbar userInfo={userInfo} />
        <Notes userInfo={userInfo} />
        <Footer />
      </div>
    </>
  );
};

export default Page;
