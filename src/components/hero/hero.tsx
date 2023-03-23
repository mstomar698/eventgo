import Link from 'next/link';

const Hero = () => {
  return (
    <div className="h-full my-1 flex flex-col text-center items-center justify-center  border-2 border-solid border-orange-500 rounded-sm">
      <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5 text-red-500">
        Hero Section
      </div>
      {/* <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
        <Link href={'/event/event'} className="text-red-500">
          Event Page
        </Link>
      </div> */}
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
    </div>
  );
};

export default Hero;
