'use client';
import Link from 'next/link';
import useFetch, { revalidate } from 'http-react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import Signup from '@/pages/auth/signup';
import { useState } from 'react';
import { BiTrashAlt, BiArrowToLeft, BiPlus } from 'react-icons/bi';
import { IPost } from '@/lib/models';
import CalendarPage from '@/pages/calender/calender';

function confirmPostDelete(id: any) {
  const confirmation = confirm('Do you want to remove this post?');
  if (confirmation) {
    revalidate(id);
  }
}

function Post(props: any) {
  const fetchID = {
    post: props,
  };

  useFetch('/posts', {
    id: fetchID,
    method: 'DELETE',
    query: {
      id: props._id,
    },
    onResolve() {
      revalidate('GET /posts');
    },
  });

  return (
    <div
      className="bg-gray-500 hover:bg-black card p-1 pt-2 relative break-words rounded-lg hover:border-red-500 hover:border-2 hover:border-solid card-bordered m-4"
      key={`post-${props._id}`}
    >
      <button
        title="delete-post"
        className="btn btn-ghost font-semibold border-2 border-solid border-green-500 text-green-500 rounded-full absolute top-1 right-1 cursor-pointer"
        onClick={() => confirmPostDelete(fetchID)}
      >
        <BiTrashAlt name="trash" className="text-xl" />
      </button>
      <p className="mt-2 mb-1 text-sm">{props.title}</p>
      <p className="my-0.5 overflow-hidden hover:overflow-y-scroll h-20 p-1 text-xs ">{props.content}</p>
    </div>
  );
}

function Posts() {
  const { data, loadingFirst, error } = useFetch<IPost[]>('/posts', {
    default: [],
  });

  if (loadingFirst)
    return (
      <div className="h-[440px] w-full my-1  rounded-sm text-white bg-gray-700 text-center flex justify-center items-center">
        <p className="text-2xl font-semibold py-4">Loading posts...</p>
      </div>
    );

  if (error)
    return (
      <div className="h-[440px] w-full my-1  rounded-sm text-white bg-gray-700 text-center flex justify-center items-center">
        <p className="text-2xl font-semibold py-4">Failed to Fetch posts...</p>
      </div>
    );

  const mappedPosts = data.map((post) => (
    <Post {...post} key={`post-${post._id}`} />
  ));

  return (
    <div className="h-[440px] lg:overflow-y-scroll max-sm:h-full max-md:h-full w-full rounded-sm text-white bg-gray-700">
      <div className="relative p-1 max-sm:mt-2 space-x-2 flex flex-row w-full">
        <Link
          href="/"
          className="border-2 border-solid max-sm:p-0 border-red-500 p-1 text-xs flex items-center justify-center w-full py-2 font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
        >
          <button className="flex flex-row space-x-4 justify-between">
            <BiArrowToLeft name="plus" className="text-xl" />
            <span className="my-0.5">Back</span>
          </button>
        </Link>
        <Link
          href="/posts/create"
          className="border-2 border-solid max-sm:p-0 border-red-500 p-1 text-xs flex items-center justify-center w-full py-2  font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
        >
          <button className="flex flex-row space-x-4 justify-between">
            <BiPlus name="arrow-left" className="text-xl" />
            <span className="my-0.5">Add post</span>
            <span className="my-0.5">{data.length}</span>
          </button>
        </Link>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 rounded-md">
          {mappedPosts}
        </div>
      </div>
    </div>
  );
}

const Notes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <>
      {isAuthenticated ? (
        <div className="h-full max-md:h-full max-sm:h-full w-full p-1 flex flex-col border-2 border-solid border-red-500">
          <Navbar title={'Notes'} />
          <div className="h-full flex p-0.5 max-sm:flex-col md:flex-col lg:flex-row max-md:flex-col border-2 border-solid border-orange-500 rounded-sm my-1">
            <Posts />
            <CalendarPage />
          </div>
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

export default Notes;
