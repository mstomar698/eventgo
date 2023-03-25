'use client';
import Link from 'next/link';
import useFetch, { revalidate } from 'http-react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import Signup from '@/pages/auth/signup';
import { useState } from 'react';
import { BiTrashAlt, BiArrowToLeft, BiPlus } from 'react-icons/bi';
import { ITheme } from '@/lib/models';

function confirDeleteTheme(id: any) {
  const confirmation = confirm('Do you want to remove this Theme?');
  if (confirmation) {
    revalidate(id);
  }
}

function Theme(props: any) {
  const fetchID = {
    theme: props,
  };

  useFetch('/themes', {
    id: fetchID,
    method: 'DELETE',
    query: {
      id: props._id,
    },
    onResolve() {
      revalidate('GET /themes');
    },
  });
  console.log(props);
  return (
    <div
      className="bg-gray-500 hover:bg-black card p-2 relative break-words rounded-lg hover:border-red-500 hover:border-2 hover:border-solid card-bordered m-4 flex flex-wrap h-[180px] overflow-hidden"
      key={`theme-${props._id}`}
    >
      <button
        title="delete-theme"
        className="btn btn-ghost font-semibold border-2 border-solid border-green-500 text-green-500 rounded-full absolute top-1 right-1 cursor-pointer"
        onClick={() => confirDeleteTheme(fetchID)}
      >
        <BiTrashAlt name="trash" className="text-xl" />
      </button>
      <p className="my-1 text-sm w-full px-4 text-center">{props.title}</p>
      <div className="my-0.5 p-1 h-4/5 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 rounded-md items-center justify-center text-center hover:overflow-y-scroll max-sm:overflow-auto max-md:overflow-auto ">
        {props.events.map((event: any) => (
          <>
            <button
              key={event}
              className="text-sm border-2 border-red-500 border-solid m-2 p-0.5 text-center rounded-lg hover:bg-gray-500"
            >
              {/* NOTE: update to searchbar route later */}
              <Link href={`/${event}`}>{event}</Link>
            </button>
          </>
        ))}
      </div>
    </div>
  );
}

function Themes() {
  const { data, loadingFirst, error } = useFetch<ITheme[]>('/themes', {
    default: [],
  });

  if (loadingFirst)
    return (
      <div className="border-2 border-solid border-orange-500 rounded-sm my-1 h-screen w-full text-white bg-gray-700 text-center flex justify-center items-center">
        <p className="text-2xl font-semibold py-4">Loading Themes...</p>
      </div>
    );

  if (error)
    return (
      <div className="border-2 border-solid border-orange-500 rounded-sm my-1 h-screen  w-full text-white bg-gray-700 text-center flex justify-center items-center">
        <p className="text-2xl font-semibold py-4">Failed to Fetch Themes...</p>
      </div>
    );

  const mappedThemes = data.map((theme) => (
    <Theme {...theme} key={`theme-${theme._id}`} />
  ));

  return (
    <div className="h-full overflow-y-auto border-2 border-solid border-orange-500 rounded-sm my-1 bg-gray-700 max-md:overflow-y-scroll">
      <div className="relative p-1 max-sm:mt-2 space-x-2 flex flex-row w-full">
        <Link
          href="/"
          className="border-2 border-solid max-sm:p-0 border-red-500 p-1 text-xs flex items-center justify-center w-full py-2 font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
        >
          <button className="flex flex-row space-x-4 justify-between">
            <BiArrowToLeft name="arrow-left" className="text-xl" />
            <span className="my-0.5">Back</span>
          </button>
        </Link>
        <Link
          href="/themes/create"
          className="border-2 border-solid max-sm:p-0 border-red-500 p-1 text-xs flex items-center justify-center w-full py-2  font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
        >
          <button className="flex flex-row space-x-4 justify-between">
            <BiPlus name="add-theme" className="text-xl" />
            <span className="my-0.5">Add Theme</span>
            <span className="my-0.5">{data.length}</span>
          </button>
        </Link>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 rounded-md">
          {mappedThemes}
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <>
      {isAuthenticated ? (
        <div className="h-screen max-sm:h-full max-md:h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
          <Navbar title={'Themes'} />
          <Themes />
          <Footer />
        </div>
      ) : (
        <div className="h-screen w-full max-sm:h-screen md:h-screen">
          <Signup />
        </div>
      )}
    </>
  );
};

export default Page;
