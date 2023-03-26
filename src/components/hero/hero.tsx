'use client';
import Image from 'next/image';
import Link from 'next/link';
import HeroFlow from './heroflow';
import b from './asd2.gif';
import { BiArrowToRight } from 'react-icons/bi';
import { useState } from 'react';

const Hero = () => {
  const [showElement, setShowElement] = useState(false);

  const handleButtonClick = () => {
    setShowElement(true);
  };
  return (
    <div className="h-full my-1 border-2 flex flex-row max-sm:flex-col border-solid border-orange-500 rounded-sm">
      <div className="max-sm:hidden w-2/5 max-sm:w-full max-md:w-full hero_iamge">
        <div className="h-full w-full rounded-b-sm  pt-72 flex flex-row space-x-4 px-2 pb-1">
          <button className="border-2 border-solid  border-red-500 p-1 text-xl flex items-center justify-center w-full py-2  font-medium transition-colors duration-150 heroCard_image rounded-lg hover:bg-black hover:border-green-500  focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600">
            <Link href="/posts" className="">
              Prepare Schedule
            </Link>
          </button>
          <button
            onClick={handleButtonClick}
            className="border-2 border-solid  border-red-500 p-1 text-xl flex items-center justify-center w-full py-2  font-medium transition-colors hover:border-green-500 duration-150 heroCard_image1 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600"
          >
            Research Event
          </button>
          <button className="border-2 border-solid  border-red-500 p-1 text-xl flex items-center justify-center w-full py-2 hover:border-green-500 font-medium transition-colors duration-150 heroCard_image2 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600">
            <Link href={'/themes'} className="">
              Design Event
            </Link>
          </button>
        </div>
      </div>
      <div className="w-3/5 max-sm:h-full max-sm:w-full  border-l-2 border-solid border-green-500 max-sm:border-0 max-sm:rounded-sm">
        <HeroFlow />
        <div className="absolute lg:hidden left-0 top-0 z-50 md:hidden">
          <div className="h-full w-full rounded-b-sm  pt-72 flex flex-col space-y-4 px-4 pb-1 justify-between items-start ">
            <button className="border-2 border-solid  border-red-500 p-1 text-xl flex items-center justify-center w-full py-2  font-medium transition-colors duration-150 heroCard_image rounded-lg hover:bg-black hover:border-green-500  focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600">
              <Link href="/posts" className="">
                Prepare Schedule
              </Link>
            </button>
            <button
              onClick={handleButtonClick}
              className="border-2 border-solid  border-red-500 p-1 text-xl flex items-center justify-center w-full py-2  font-medium transition-colors hover:border-green-500 duration-150 heroCard_image1 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600"
            >
              Research Event
            </button>
            <button className="border-2 border-solid  border-red-500 p-1 text-xl flex items-center justify-center w-full py-2 hover:border-green-500 font-medium transition-colors duration-150 heroCard_image2 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600">
              <Link href={'/themes'} className="">
                Design Event
              </Link>
            </button>
          </div>
        </div>
      </div>
      {showElement && (
        <div className="fixed h-screen w-screen top-0 bottom-0 left-0 right-0 z-50">
          <div className="h-full w-full border-2 border-solid border-orange-500 rounded-sm my-1 bg-gray-700 p-16 flex flex-col space-y-4 text-center items-center justify-center">
            <Link
              href={'/'}
              onClick={() => setShowElement(false)}
              className="border-2 border-solid  border-red-500 p-4 text-xl flex items-center justify-center w-44 py-2 hover:border-green-500 font-medium transition-colors duration-150 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600"
            >
              Home
            </Link>
            <Link
              href={'/eventrecomm'}
              className="border-2 border-solid  border-red-500 p-4 text-xl flex items-center justify-center w-44 py-2 hover:border-green-500 font-medium transition-colors duration-150 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600 "
            >
              Recommendations Page
            </Link>
            <Link
              href={'/themerecomm'}
              className="border-2 border-solid  border-red-500 p-4 text-xl flex items-center justify-center w-44 py-2 hover:border-green-500 font-medium transition-colors duration-150 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600"
            >
              Theme Recommendations
            </Link>
            <Link
              href={'/info'}
              className="border-2 border-solid  border-red-500 p-4 text-xl flex items-center justify-center w-44 py-2 hover:border-green-500 font-medium transition-colors duration-150 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray text-green-600 hover:text-red-600"
            >
              Theme & Event INFO
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;

{
  /**
<div>
        <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
          <Link href={'/themes'} className="text-red-500">
            Themes Page
          </Link>
        </div>
        <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
          <Link href="/posts" className="text-red-500">
            Notes App
          </Link>
        </div>
        <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
          <Link href={'/eventrecomm'} className="text-red-500">
            Recommendations Page
          </Link>
        </div>
        <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
          <Link href={'/themerecomm'} className="text-red-500">
            Theme Recommendations
          </Link>
        </div>
        <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
          <Link href={'/info'} className="text-red-500">
            Theme & Event INFO
          </Link>
        </div>
        <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
          <Link href={'/planner'} className="text-red-500">
            Event Planner
          </Link>
        </div>
      </div>

*/
}
