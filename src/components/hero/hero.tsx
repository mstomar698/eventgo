import Link from 'next/link';

const Hero = () => {
  return (
    <div className="h-full my-1 flex flex-col text-center items-center justify-center  border-2 border-solid border-green-400">
      Hero
      <div>
        <Link href={'/event/event'} className="text-blue-500">
          pages
        </Link>
      </div>
      <div>
        <Link href={'/theme/theme'} className="text-blue-500">
          Themes
        </Link>
      </div>
      <div>
        <Link href="/posts" className="text-green-500">
          Posts
        </Link>
      </div>
    </div>
  );
};

export default Hero;
