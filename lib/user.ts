import { NextPageContext, NextApiRequest } from 'next';
import cookie from 'cookie';

type UserInfo = {
  name: string;
  email: string;
};
export function useUserInfo(ctx?: NextPageContext): UserInfo | null {
  const cookies = cookie.parse(
    (ctx?.req?.headers.cookie || '') +
      (typeof document !== 'undefined' ? document.cookie : '')
  );

  const userInfo = cookies.userInfo;

  if (userInfo) {
    return JSON.parse(userInfo);
  }

  return null;
  // const userInfo: UserInfo | null = {
  //   name: 'John Doe',
  //   email: 'john.doe@example.com',
  // };

  // return userInfo;
}

export async function getUserInfo(
  req: NextApiRequest
): Promise<UserInfo | null> {
  const cookies = cookie.parse(req.headers.cookie || '');

  const userInfo = cookies.userInfo;

  if (userInfo) {
    return JSON.parse(userInfo);
  }

  return null;
  // const userInfo: UserInfo | null = {
  //   name: 'John Doe',
  //   email: 'john.doe@example.com',
  // };

  // return userInfo;
}
