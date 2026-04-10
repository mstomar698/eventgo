'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RiLogoutBoxRLine, RiLoginBoxLine } from 'react-icons/ri';
import { RxCross1 } from 'react-icons/rx';
import { BiUser } from 'react-icons/bi';
import { signIn, signOut, useSession } from 'next-auth/react';

interface NavbarProps {
  title: string;
}

const Navbar = ({ title }: NavbarProps) => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const isLoggedIn = Boolean(session);
  const userName = session?.user?.name ?? 'User';
  const userImage =
    session?.user?.image ?? 'https://avatars.githubusercontent.com/u/25550150?v=4';

  return (
    <div className="z-10 text-3xl text-purple-500 text-center rounded-sm border-2 border-solid border-green-500 flex items-center justify-between px-2">
      <div className="flex items-center">
        <Link href="/">
          <p className="text-lg max-sm:text-sm max-sm:font-semibold font-bold mx-1">
            {title}
          </p>
        </Link>
      </div>

      <div className="hidden md:flex flex-row justify-between items-center space-x-2 px-1 py-0.5 rounded-lg">
        {isLoggedIn ? (
          <>
            <Link
              href="/profile"
              className="border-2 rounded-lg px-2 border-solid border-indigo-500 flex flex-row items-center space-x-1 text-sm"
            >
              <BiUser className="inline-block text-red-500" size={15} />
              <span className="text-green-500">Profile</span>
            </Link>
            <button
              title="user-avatar"
              type="button"
              onClick={() => setIsPromptOpen((current) => !current)}
              className="rounded-full"
            >
              <Image
                className="h-6 w-6 rounded-full border-solid border-red-500 border-2"
                src={userImage}
                alt="Avatar"
                width={32}
                height={32}
              />
            </button>
          </>
        ) : (
          <button
            title="signin"
            type="button"
            onClick={() => signIn()}
            className="border-2 rounded-lg px-1 border-solid border-red-500 flex flex-row items-center space-x-0.5"
          >
            <span className="text-sm mb-0.5">Signin</span>
            <RiLoginBoxLine className="inline-block text-green-500" size={15} />
          </button>
        )}
      </div>

      <div className="md:hidden text-red-500 items-center justify-center h-full text-center mt-1">
        <button
          title="toggle-menu"
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <GiHamburgerMenu size={25} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-black z-20">
          <div className="flex flex-col justify-center h-full items-center text-center space-y-2">
            <button title="close-menu" type="button" onClick={() => setIsMenuOpen(false)}>
              <RxCross1 className="inline-block text-red-500 " size={30} />
            </button>

            <Link
              href="/"
              className="border-2 rounded-lg p-2 border-solid border-green-500 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="border-2 rounded-lg p-2 border-solid border-indigo-500 flex flex-row items-center space-x-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg text-green-500 trim w-20 overflow-hidden">
                    {userName}
                  </span>
                  <BiUser className="inline-block text-red-500" size={20} />
                </Link>
                <button
                  title="logout"
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="border-2 rounded-lg p-2 border-solid border-indigo-500 flex flex-row items-center space-x-1"
                >
                  <span className="text-lg text-green-500">Logout</span>
                  <RiLogoutBoxRLine className="inline-block text-red-500" size={20} />
                </button>
              </>
            ) : (
              <button
                title="signin"
                type="button"
                onClick={() => signIn()}
                className="border-2 rounded-lg p-2 border-solid border-red-500 flex flex-row items-center space-x-1"
              >
                <span className="text-lg mb-0.5">Signin</span>
                <RiLoginBoxLine className="inline-block text-green-500" size={25} />
              </button>
            )}
          </div>
        </div>
      )}

      {isPromptOpen && isLoggedIn && (
        <div className="absolute max-sm:hidden top-9 right-4 w-[220px] bg-black rounded-lg border-solid border-4 border-red-500 p-4 h-[180px] items-center justify-center text-center flex z-20">
          <div className="flex flex-col text-center items-center justify-center space-y-2">
            <Link
              href="/profile"
              className="border-2 rounded-lg p-2 border-solid border-indigo-500 flex flex-row items-center space-x-1"
              onClick={() => setIsPromptOpen(false)}
            >
              <span className="text-lg text-green-500 trim w-20 overflow-hidden">
                {userName}
              </span>
              <BiUser className="inline-block text-red-500" size={20} />
            </Link>
            <button
              title="logout"
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="border-2 rounded-lg p-2 border-solid border-indigo-500 flex flex-row items-center space-x-1"
            >
              <span className="text-lg text-green-500">Logout</span>
              <RiLogoutBoxRLine className="inline-block text-red-500" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
