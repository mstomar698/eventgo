'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useObject } from 'react-kuh';

import Link from 'next/link';
import { BiCross, BiArrowToLeft, BiPlus } from 'react-icons/bi';

import useFetch, { revalidate } from 'http-react';
import Input from '@/components/input/input';

function savePost() {
  revalidate('POST /posts');
}

export default function Create() {
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

  // This is not automatic, this is a mutation
  useFetch('/posts', {
    method: 'POST',
    body: { ...newPost, _id: undefined },
    onResolve() {
      router.back();
    },
  });

  return (
    <div className="bg-blue-300 text-red-400">
      <Link href="/posts" className="btn gap-x-2 btn-ghost">
        <BiPlus name="arrow-left" className="text-xl" /> Back
      </Link>
      <div>Add post</div>
      <div className="flex flex-wrap w-full md:w-96 items-center justify-center space-y-2">
        <div className="w-full">
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
        <div className="w-full">
          <textarea
            placeholder="Content"
            className="textarea textarea-bordered h-32 resize-none w-full"
            name="content"
            onChange={(e) =>
              setPost.write({
                content: e.target.value,
              })
            }
          ></textarea>
        </div>
        <div className="w-full text-center">
          <button onClick={savePost} className="btn gap-x-2">
            <span>Save</span>
            <BiPlus name="disc" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
