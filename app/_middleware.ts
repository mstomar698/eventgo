import { NextApiRequest } from 'next';
import { getUserInfo } from '@/lib/user';
import { NextFetchEvent, NextResponse } from 'next/server';

export async function middleware(req: NextApiRequest, ev: NextFetchEvent) {
  const userInfo = await getUserInfo(req);
  console.log(userInfo);
  if (!userInfo) {
    console.log('Redirecting to /auth');
    return NextResponse.redirect('/auth');
  }

  const path = req.url;
  console.log('Request path:', path);

  if (path === '/schedule' || path!.startsWith('/schedule/')) {
    console.log('asdasd');
    return NextResponse.next();
  }
  if (path === '/planner' || path!.startsWith('/planner/')) {
    return NextResponse.next();
  }
  if (path === '/recommend' || path!.startsWith('/recommend/')) {
    return NextResponse.next();
  }
  if (path === '/profile' || path!.startsWith('/profile/')) {
    return NextResponse.next();
  }

  return NextResponse.redirect('/auth');
}
