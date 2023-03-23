'use client';
import Link from 'next/link';
import useFetch, { revalidate } from 'http-react';
import { BiCross, BiArrowToLeft, BiPlus } from 'react-icons/bi';
import { ITheme } from '@/lib/models';

function confirmPostDelete(id: any) {
  const confirmation = confirm('Do you want to remove this post?');
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

  return (
    <div
      className="bg-green-400 card p-4 relative break-words rounded-lg hover:border-neutral-400 card-bordered m-4"
      key={`theme-${props._id}`}
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
      <p className="my-4">{props.events}</p>
    </div>
  );
}

export default function Themes() {
  const { data, loadingFirst, error } = useFetch<ITheme[]>('/themes', {
    default: [],
  });

  if (loadingFirst)
    return <p className="text-2xl font-semibold py-4">Loading themes...</p>;

  if (error)
    return <p className="text-2xl text-red-400 py-4">Failed to fetch themes</p>;

  const mappedThemes = data.map((theme) => (
    <Theme {...theme} key={`theme-${theme._id}`} />
  ));

  return (
    <div className="bg-yellow-500">
      <div>Themes ({data.length})</div>
      <div className="flex bg-red-400 space-x-4">
        <Link href="/" className="btn gap-x-2 btn-ghost">
          <BiCross name="arrow-left" className="text-xl" /> Back
        </Link>
        <Link href="/themes/create" className="btn gap-x-2">
          Add Theme <BiCross name="plus" className="text-xl" />
        </Link>
      </div>
      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 rounded-md">
        {mappedThemes}
      </div>
    </div>
  );
}
