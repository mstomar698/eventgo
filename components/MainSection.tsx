import { styles } from '@/app/styles';
import PageCard from './PageCard';
import { Pages } from '@/constants';

const MainSection = () => {
  return (
    <section
      id="main"
      className={`${styles.padding} relative min-h-screen text-tertiary flex justify-center items-center`}
    >
      <div className="absolute bg-main-pattern opacity-20 top-0 left-0 w-full h-full z-[-10] bg-cover bg-no-repeat bg-center"></div>
     <div className={`flex flex-wrap w-full h-full justify-evenly mt-8 md:gap-4 lg:gap-8 sm:gap-2 max-sm:gap-4`}>
     {Pages.map((page, index) => (
        <div
          className={`min-w-max min-h-max `}
          key={`Page-${index}`}
        >
          <PageCard index={index} {...page} />
        </div>
      ))}
     </div>
    </section>
  );
};

export default MainSection;
