'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useObject } from 'react-kuh';

import Link from 'next/link';
import { BiArrowToLeft, BiSave } from 'react-icons/bi';

import useFetch, { revalidate } from 'http-react';
import Input from '@/components/input/input';
import Signup from '@/pages/auth/signup';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';

function savePost() {
  revalidate('POST /posts');
}

function Create() {
  const router = useRouter();

  const [post, setPost] = useObject({
    title: '',
    content: '',
  });

  const newPostDate = useMemo(() => Date.now(), []);

  const newPost = {
    ...post,
    date: newPostDate,
  };

  useFetch('/posts', {
    method: 'POST',
    body: { ...newPost, _id: undefined },
    onResolve() {
      router.back();
    },
  });

  return (
    <div className="h-full border-2 border-solid border-orange-500 rounded-sm my-1 bg-gray-700">
      <div className="relative p-1 max-sm:mt-2 space-x-2 flex flex-row w-full">
        <Link
          href="/posts"
          className="border-2 border-solid border-red-500 p-1 text-xs flex items-center justify-center w-full py-2 font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
        >
          <button className="flex flex-row space-x-4 justify-between">
            <BiArrowToLeft name="plus" className="text-xl" />
            <span className="my-0.5">Back</span>
          </button>
        </Link>
      </div>
      <div className="flex flex-wrap h-auto bg-gray-500 m-16 max-sm:m-10 items-center justify-center space-y-2 p-1 rounded-lg">
        <div className="w-full text-black rounded-sm border-2 border-solid border-green-500 ">
          <Input
            value={post.title}
            name="title"
            onChange={(e) =>
              setPost.write({
                title: e.target.value,
              })
            }
            placeholder="Title"
          />
        </div>
        <div className="w-full p-0">
          <textarea
            placeholder="Content"
            className="textarea textarea-bordered h-36 max-sm:h-64 max-md:h-64  overflow-y-scroll p-2 w-full text-black rounded-sm border-2 border-solid border-green-500 "
            name="content"
            required
            onChange={(e) =>
              setPost.write({
                content: e.target.value,
              })
            }
          />
        </div>

        <button
          className="border-2 border-solid border-red-500 p-1 text-xs flex items-center w-full py-2 font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray flex-row space-x-4 justify-center"
          onClick={savePost}
        >
          <BiSave name="save" className="text-xl" />
          <span className="my-0.5">Save Note</span>
        </button>

        {/* <div className="w-full text-center">
          <button  className="btn gap-x-2">
            <span>Save</span>
            <BiPlus name="disc" className="text-xl" />
          </button>
        </div> */}
      </div>
    </div>
  );
}

const CreateNotes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <>
      {isAuthenticated ? (
        <div className="h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
          <Navbar title={'Create-Notes'} />
          <Create />
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

export default CreateNotes;
