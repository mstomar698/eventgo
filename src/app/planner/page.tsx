'use client';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import SignInRequired from '@/features/auth/sign-in-required';
import Flowchart from '@/features/planner/flowchart';
import { useSession } from 'next-auth/react';

const Planner = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  return (
    <>
      {isLoggedIn ? (
        <div className="h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
          <Navbar title={'Planner'} />
          <Flowchart />
          <Footer />
        </div>
      ) : (
        <SignInRequired title="Planner access requires sign in" />
      )}
    </>
  );
};

export default Planner;
