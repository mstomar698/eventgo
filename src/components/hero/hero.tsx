import Link from 'next/link';

const Hero = () => {
  return (
    <div className="h-full my-1 flex flex-col text-center items-center justify-center  border-2 border-solid border-orange-500 rounded-sm">
      <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5 text-red-500">
        Hero Section
      </div>
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
        <Link
          href={'/recommendations/recommendations'}
          className="text-red-500"
        >
          Recommendations Page
        </Link>
      </div>
      <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
        <Link
          href={'/recommendations/themerecommendations'}
          className="text-red-500"
        >
          Theme Recommendations
        </Link>
      </div>
      <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
        <Link
          href={'/recommendations/info'}
          className="text-red-500"
        >
          Theme & Event INFO
        </Link>
      </div>
      <div className="border-2 border-solid border-green-500 p-1 rounded-lg m-0.5">
        <Link
          href={'/planner'}
          className="text-red-500"
        >
          Event Planner
        </Link>
      </div>
    </div>
  );
};

export default Hero;
