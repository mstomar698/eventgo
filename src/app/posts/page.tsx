'use client';
import Link from 'next/link';
import useFetch, { revalidate } from 'http-react';
import { BiCross, BiArrowToLeft, BiPlus } from 'react-icons/bi';
import { IPost } from '@/lib/models';

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
      className="bg-green-400 card p-4 relative break-words rounded-lg hover:border-neutral-400 card-bordered m-4"
      key={`post-${props._id}`}
    >
      <button
        title="delete-post"
        className="btn btn-ghost font-semibold absolute top-1 right-1 cursor-pointer"
        onClick={() => confirmPostDelete(fetchID)}
      >
        <BiCross name="trash" className="text-xl" />
      </button>
      <b className="my-2">{props.title}</b>
      <br />
      <p className="my-4">{props.content}</p>
    </div>
  );
}

export default function Posts() {
  const { data, loadingFirst, error } = useFetch<IPost[]>('/posts', {
    default: [],
  });

  if (loadingFirst)
    return <p className="text-2xl font-semibold py-4">Loading posts...</p>;

  if (error)
    return <p className="text-2xl text-red-400 py-4">Failed to fetch posts</p>;

  const mappedPosts = data.map((post) => (
    <Post {...post} key={`post-${post._id}`} />
  ));

  return (
    <div className="bg-yellow-500">
      <div>Your posts ({data.length})</div>
      <div className="flex bg-red-400 space-x-4">
        <Link href="/" className="btn gap-x-2 btn-ghost">
          <BiCross name="arrow-left" className="text-xl" /> Back
        </Link>
        <Link href="/posts/create" className="btn gap-x-2">
          Add one post <BiCross name="plus" className="text-xl" />
        </Link>
      </div>
      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 rounded-md">
        {mappedPosts}
      </div>
    </div>
  );
}
