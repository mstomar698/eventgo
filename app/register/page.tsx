'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { setCookie, getCookie } from 'cookies-next';
import Axios from 'axios';
import { cokkieProvider } from '@/lib/user';

const Page = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log('pasd error');
      return;
    }
    try {
      const { data } = await Axios.post(
        'https://descriptive-bubble-production.up.railway.app/auth/signup',
        {
          name,
          email,
          password,
        }
      );
      console.log(data);
      if (data) {
        setCookie('CLR', data);
        window.location.href = '/';
      }
    } catch (err: any) {
      console.error('not aalowed');
    }
  };
  useEffect(() => {
    const checkCookie = cokkieProvider();
    if (checkCookie) {
      console.log(checkCookie);
      window.location.href = '/';
    }
  }, [cokkieProvider]);

  return (
    <div
      className="h-screen p-6 md:p-32"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-vector/account-concept-illustration_114360-399.jpg?w=740&t=st=1681932912~exp=1681933512~hmac=646452bc4a0ef0073259c93d3420606eb132778f1c46a99b4d2c44b8e2f548b2)`,
        backdropFilter: 'blur(25px)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-md mx-auto p-6 md:p-12 border-2 hover:border-4 hover:border-gray-700 rounded shadow-xl">
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 font-bold text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              className="w-full px-3 py-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 font-bold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 font-bold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 font-bold text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              className="w-full px-3 py-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </button>
          <div className="my-3">
            Already have an account?{' '}
            <Link href={`/auth`}>
              <span className="text-blue-500 font-semibold">Sign-In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
