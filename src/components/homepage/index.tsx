import Footer from '../footer/footer';
import Hero from '../hero/hero';
import Navbar from '../navbar/navbar';

const HomePage = () => {
  return (
    <div className="h-full w-full p-1 flex flex-col border-2 border-solid border-red-500">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default HomePage;
