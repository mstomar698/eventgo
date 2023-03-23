'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useObject } from 'react-kuh';

import Link from 'next/link';
import { BiCross, BiArrowToLeft, BiPlus } from 'react-icons/bi';

import useFetch, { revalidate } from 'http-react';
import Input from '@/components/input/input';

function saveTheme() {
  revalidate('POST /themes');
}

export default function Create() {
  const router = useRouter();

  const [theme, setTheme] = useObject({
    title: '',
    date: '',
    events: [],
  });

  const newTheme = {
    ...theme,
  };

  // This is not automatic, this is a mutation
  useFetch('/themes', {
    method: 'POST',
    body: { ...newTheme, _id: undefined },
    onResolve() {
      router.back();
    },
  });

  return (
    <div className="bg-blue-300 text-red-400">
      <Link href="/themes" className="btn gap-x-2 btn-ghost">
        <BiPlus name="arrow-left" className="text-xl" /> Back
      </Link>
      <div>Add Theme</div>
      <div className="flex flex-wrap w-full md:w-96 items-center justify-center space-y-2">
        <div className="w-full">
          <Input
            value={theme.title}
            name="title"
            onChange={(e) =>
              setTheme.write({
                title: e.target.value,
              })
            }
            placeholder="Title"
          />
        </div>
        <div className="w-full">
          <textarea
            placeholder="date"
            className="textarea textarea-bordered h-32 resize-none w-full"
            name="date"
            onChange={(e) =>
              setTheme.write({
                date: e.target.value,
              })
            }
          ></textarea>
        </div>
        <div className="w-full text-center">
          <button onClick={saveTheme} className="btn gap-x-2">
            <span>Save</span>
            <BiPlus name="disc" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
