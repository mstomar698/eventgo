import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const userInfo = request.cookies.get('userInfo');

  if (!userInfo) {
    console.log('Redirecting to /auth');
  }
  console.log('mid \n' + userInfo);
  const path = request.url;
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

  return NextResponse.next();
}
