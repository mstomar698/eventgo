import { Footer, HomePage, MainSection, Navbar } from '@/components';

export default function Home() {
  return (
    <div className="relative z-0 bg-primary overflow-hidden">
      <Navbar />
      <HomePage />
      <MainSection />
      <Footer />
    </div>
  );
}
