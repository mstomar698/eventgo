import { Footer, HomePage, MainSection, Navbar } from '@/components';
import { cookies } from 'next/headers';

type UserInfo = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

export default function Home() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  const userInfoCookie: any = allCookies.find(
    (cookie) => cookie.name === 'CLR'
  );
  if (userInfoCookie !== undefined) {
    var userInfo = JSON.parse(userInfoCookie?.value);
  } else {
    var userInfo: any = null;
  }

  return (
    <div className="relative z-0 bg-primary overflow-hidden">
      <Navbar userInfo={userInfo} />
      <HomePage />
      <MainSection />
      <Footer />
    </div>
  );
}
