import React, { useEffect, useState } from 'react';
import { styles } from '@/app/styles';
import Image from 'next/image';
import { BsMenuUp } from 'react-icons/bs';
import { FaWindowClose } from 'react-icons/fa';
import { logo } from '@/assets';
import { useUserInfo } from '@/lib/user';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userInfo = useUserInfo();
  if (!userInfo) {
    if (typeof window !== 'undefined') {
      console.log('No userInfo provide in user.ts');
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 1) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    console.log('Implement Sign Out');
  };

  return (
    <div
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? 'bg-transparent backdrop-blur-3xl' : 'bg-transparent'
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <div
          className="flex items-center gap-2"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <Image
            src={logo}
            alt="logo"
            className="w-9 h-9 object-contain rounded-xl shadow-md shadow-active"
          />
          <p className="text-secondary text-[18px] font-bold cursor-pointer flex ">
            <span className={``}>EventGo</span>
          </p>
        </div>
        <ul className="list-none hidden sm:flex flex-row gap-10 max-md:gap-6">
          <li className={`hover:text-active font-medium cursor-pointer`}>
            {userInfo ? (
              <>
                <button
                  className={`${styles.heroSubText} shadow-md shadow-secondary px-2 py-0.5 rounded-md active:text-tertiary`}
                  onClick={() => handleSignOut()}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  className={`${styles.heroSubText} shadow-md shadow-secondary px-2 py-0.5 rounded-md active:text-tertiary`}
                  onClick={() => (window.location.href = `/auth`)}
                >
                  Sign In
                </button>
              </>
            )}
          </li>
          {userInfo && (
            <li className={`hover:text-active font-medium cursor-pointer`}>
              <button
                className={`${styles.heroSubText} shadow-md shadow-secondary px-2 py-0.5 rounded-md active:text-tertiary flex flex-row flex-wrap items-center`}
                onClick={() => (window.location.href = `/profile`)}
              >
                <Image
                  src={logo}
                  alt="logo"
                  className="w-7 h-7 object-contain rounded-xl mr-1"
                />
                {userInfo.name}
              </button>
            </li>
          )}
        </ul>
        <div className="sm:hidden flex flex-1 justify-end items-center">
          {toggle ? (
            <>
              <FaWindowClose
                className={`${styles.sectionHeadText} h-[28px] w-[28px] object-contain`}
                onClick={() => setToggle(!toggle)}
              />
            </>
          ) : (
            <>
              <BsMenuUp
                className={`${styles.sectionHeadText} h-[28px] w-[28px] object-contain`}
                onClick={() => setToggle(!toggle)}
              />
            </>
          )}
          <div
            className={`${
              !toggle ? 'hidden' : 'flex'
            } p-6 bg-secondary/50 backdrop-blur-3xl border border-active absolute top-20 right-5 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-2">
              <li className={`font-medium`}>
                {userInfo ? (
                  <>
                    <button
                      className={`${styles.heroSubText} text-active hover:text-tertiary`}
                      onClick={() => handleSignOut()}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`${styles.heroSubText} text-active hover:text-tertiary`}
                      onClick={() => (window.location.href = `/auth`)}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </li>
              {userInfo && (
                <>
                  <li className={`font-medium`}>
                    <button
                      className={`${styles.heroSubText} text-active hover:text-tertiary flex flex-row flex-wrap items-center`}
                      onClick={() => (window.location.href = `/profile`)}
                    >
                      {userInfo.name}
                      <Image
                        src={logo}
                        alt="logo"
                        className="w-6 h-6 object-contain rounded-xl ml-1"
                      />
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
