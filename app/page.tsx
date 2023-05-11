import { Footer, HomePage, MainSection, Navbar } from '@/components';

type UserInfo = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

export default function Home() {
  const userInfo = '';
  return (
    <div className="relative z-0 bg-primary overflow-hidden">
      <Navbar userInfo={userInfo} />
      <HomePage />
      <MainSection />
      <Footer />
    </div>
  );
}
