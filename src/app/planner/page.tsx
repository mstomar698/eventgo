'use client';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import Flowchart from '@/pages/flowchart/flowchart';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BiCross, BiArrowToLeft, BiPlus } from 'react-icons/bi';

const Planner = () => {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (!session) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [session]);
  return (
    <>
      {isLoggedIn ? (
        <div className="h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
          <Navbar title={'Planner'} />
          <Flowchart />
          <Footer />
        </div>
      ) : (
        <div className="h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
          <Navbar title={'Planner-Not-Authenticated'} />
          <Flowchart />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Planner;
