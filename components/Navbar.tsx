import React, { useEffect, useState } from 'react';
import { styles } from '@/app/styles';
import Link from 'next/link';
import Image from 'next/image';
import { BsMenuUp } from 'react-icons/bs';
import { FaWindowClose } from 'react-icons/fa';
import { logo } from '@/assets';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <li
            className={`hover:text-active text-[18px] font-medium cursor-pointer`}
          >
            <a href={`#`}>btn1</a>
          </li>
          <li
            className={`hover:text-active text-[18px] font-medium cursor-pointer`}
          >
            <a href={`#`}>btn2</a>
          </li>
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
              <li
                className={`hover:text-active text-[18px] font-medium cursor-pointer`}
              >
                <a href={`#`}>btn1</a>
              </li>
              <li
                className={`hover:text-active text-[18px] font-medium cursor-pointer`}
              >
                <a href={`#`}>btn1</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
