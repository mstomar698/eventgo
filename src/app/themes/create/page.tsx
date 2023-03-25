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

function saveTheme() {
  revalidate('POST /themes');
}

function Create() {
  const router = useRouter();

  const [theme, setTheme] = useObject({
    title: '',
    events: [],
  });

  // const newThemeDate = useMemo(() => Date.now(), []);

  // const newTheme = {
  //   ...theme,
  //   date: newThemeDate,
  // };
  const newTheme = {
    ...theme,
    date: new Date().toISOString(),
    events: theme.events.filter((event: any) => event.trim() !== ''),
  };

  useFetch('/themes', {
    method: 'POST',
    // body: { ...newTheme, _id: undefined },
    body: { ...newTheme, _id: undefined, events: newTheme.events },
    onResolve() {
      router.back();
    },
  });

  return (
    <div className="h-full border-2 border-solid border-orange-500 rounded-sm my-1 bg-gray-700">
      <div className="relative p-1 max-sm:mt-2 space-x-2 flex flex-row w-full">
        <Link
          href="/themes"
          className="border-2 border-solid border-red-500 p-1 text-xs flex items-center justify-center w-full py-2 font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
        >
          <button className="flex flex-row space-x-4 justify-between">
            <BiArrowToLeft name="plus" className="text-xl" />
            <span className="my-0.5">Back</span>
          </button>
        </Link>
      </div>
      <div className="flex flex-wrap h-auto bg-gray-500 m-16 items-center justify-center space-y-2 p-1 rounded-lg">
        <div className="h-full w-full text-black rounded-sm border-2 border-solid border-green-500 ">
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
        <div className="h-full w-full text-black rounded-sm border-2 border-solid border-green-500 ">
          <Input
            value={theme.events.join(', ')}
            name="events"
            onChange={(e: any) =>
              setTheme.write({
                events: e.target.value.split(','),
              })
            }
            placeholder="Events (comma-separated)"
          />
        </div>

        <button
          className="border-2 border-solid border-red-500 p-1 text-xs flex items-center w-full py-2 font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray flex-row space-x-4 justify-center"
          onClick={saveTheme}
        >
          <BiSave name="save" className="text-xl" />
          <span className="my-0.5">Save Theme</span>
        </button>
      </div>
    </div>
  );
}

const CreateThemes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <>
      {isAuthenticated ? (
        <div className="h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
          <Navbar title={'Create-Themes'} />
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

export default CreateThemes;
