'use client';
import '../../app/styles/globals.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/footer/footer';
import { BiArrowToLeft } from 'react-icons/bi';
import Navbar from '@/components/navbar/navbar';
import SignIn from '@/pages/auth/signin';
import { useSession } from 'next-auth/react';

const Recommendations = () => {
  const [query, setQuery] = useState('');
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (!session) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [session]);

  const fetchRecommendation = async () => {
    const response = await fetch(`/api/chatgpt2?query=${query}`);
    const data = await response.json();
    console.log('query from recommendation page is \n' + query);
    const dataString = JSON.stringify(data);
    const recommedationData = JSON.parse(dataString);
    console.log('whole response is in string format' + dataString);
    setRecommendation(recommedationData);
    console.log('query response is ' + recommedationData.recommendation);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchRecommendation();
  };
  return (
    <>
      {isLoggedIn ? (
        <div className="h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
          <Navbar title={'Event Recommendation'} />
          <div className="h-full border-2 border-solid border-orange-500 rounded-sm my-1 bg-gray-700">
            <form
              onSubmit={handleSubmit}
              className="flex flex-row max-sm:flex-col max-md:flex-col  mx-16 my-4 max-sm:my-8 justify-between  text-center space-x-2  max-md:space-x-0 max-md:space-y-2 max-sm:space-x-0 max-sm:space-y-2"
            >
              <input
                title="Query"
                type="text"
                className="text-black px-2 w-4/5 max-sm:w-full max-md:w-full rounded-sm border-2 border-solid border-green-500"
                placeholder="Enter your query here"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                type="submit"
                className="border-2 border-solid border-red-500 p-1 text-xs flex items-center justify-center w-1/5 max-sm:w-full max-md:w-full font-medium transition-colors duration-150 bg-gray-700 rounded-sm hover:bg-black focus:outline-none focus:shadow-outline-gray"
              >
                Get Events
              </button>
            </form>
            {recommendation && (
              <div className="mx-16 h-[350px] p-4">
                <h1 className="text-start text-lg font-semibold">
                  Recommendation for: {query}{' '}
                </h1>
                <div className="my-2 p-1 w-full h-64 border-2 border-solid border-red-500 overflow-y-auto font-small transition-colors duration-150 bg-gray-700 rounded-sm hover:bg-black focus:outline-none focus:shadow-outline-gray text-center">
                  {` ${recommendation.recommendation}`}
                </div>
              </div>
            )}
            <div className="fixed bottom-10 left-5 w-24 px-1">
              <Link
                href="/"
                className="border-2 border-solid max-sm:p-0 border-red-500 p-1 text-xs flex items-center justify-center w-full py-2 font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
              >
                <button className="flex flex-row space-x-4 justify-between">
                  <BiArrowToLeft name="arrow-left" className="text-xl" />
                  <span className="my-0.5">Home</span>
                </button>
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div className="h-screen w-full max-sm:h-screen md:h-screen">
          <SignIn />
        </div>
      )}
    </>
  );
};

const Page = () => {
  return <Recommendations />;
};
export default Page;
