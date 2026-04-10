'use client';

import { signIn } from 'next-auth/react';

interface SignInRequiredProps {
  title?: string;
  description?: string;
}

const SignInRequired = ({
  title = 'Sign in required',
  description = 'This section is available to authenticated users only.',
}: SignInRequiredProps) => {
  return (
    <div className="h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
      <div className="h-full border-2 border-solid border-orange-500 rounded-sm my-1 bg-gray-700">
        <div className="h-full w-full text-center items-center justify-center flex flex-col p-16 max-sm:p-8 space-y-3">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-green-500">{description}</p>
          <button
            type="button"
            onClick={() => signIn()}
            className="border-2 mt-6 h-20 border-solid border-red-500 px-8 text-xl flex items-center justify-center font-medium transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black hover:text-white focus:outline-none focus:shadow-outline-gray"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInRequired;
