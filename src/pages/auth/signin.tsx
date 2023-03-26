import Image from 'next/image';
import '../../app/styles/globals.css';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import a from './sig.jpeg';
import { signIn, useSession } from 'next-auth/react';
import ProvidersWrapper from '@/app/providerswrapper';
import HomePage from '@/components/homepage';

const SigninPage = () => {
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
      {/* NOTE: Mkae it dynamic */}
      {isLoggedIn ? (
        <div className="h-screen w-full max-sm:h-screen md:h-screen">
          <HomePage />
        </div>
      ) : (
        <>
          <div className="h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
            <Navbar title={'SignIn'} />
            <div className="h-full border-2 border-solid border-orange-500 rounded-sm my-1 bg-gray-700">
              <div className="flex flex-row h-full">
                <div className="w-3/5 max-sm:w-full max-md:w-full h-full text-center items-center justify-center flex flex-col p-16">
                  <button
                    type="submit"
                    onClick={() => signIn()}
                    className="border-2 mt-8 h-32 border-solid max-sm:p-0 border-red-500 p-1 text-3xl flex items-center justify-center w-full py-2 font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black hover:text-white focus:outline-none focus:shadow-outline-gray"
                  >
                    Sign In
                  </button>
                  <div className="text-green-500 mt-2">
                    This feature is only for authenticated users
                  </div>
                </div>
                <div className="w-2/5 max-sm:hidden max-md:hidden h-full flex justify-center">
                  <Image
                    className="h-full w-full rounded-l-sm border-l-2 border-solid border-green-500"
                    src={a}
                    alt="Avatar"
                    width={1000}
                    height={1000}
                  />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

const SignIn = () => {
  return (
    <ProvidersWrapper>
      <SigninPage />
    </ProvidersWrapper>
  );
};

export default SignIn;
