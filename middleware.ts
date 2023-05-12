import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const userInfo = req.cookies.get('CLR')?.value;
  if (!userInfo) {
    console.log('Redirecting to /auth');
    return NextResponse.next();
  }

  const path = req.url;

  if (path === '/schedule' || path!.startsWith('/schedule/')) {
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
  if ((path === '/auth' || path.startsWith('/auth/')) && userInfo) {
    return NextResponse.next();
  }

  if ((path === '/register' || path.startsWith('/register/')) && userInfo) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
