import Image from 'next/image';
import { styles } from '@/app/styles';
import { logo } from '@/assets';
import { BsArrowUpSquare } from 'react-icons/bs';

const Footer = () => {
  return (
    <>
      <div
        className={`${styles.paddingX} relative shadow-inner shadow-tertiary flex flex-col md:flex-row justify-center items-center z-10`}
      >
        <div
          className={`${styles.paddingX} container py-0 flex flex-col md:flex-row justify-between items-center md:my-3`}
        >
          <div className="flex items-center space-x-4 w-full lg:w-auto mt-4 lg:mt-0">
            <Image
              src={logo}
              alt="logo"
              className="w-9 h-9 object-contain rounded-xl shadow-lg shadow-active"
            />{' '}
            <span className="text-sm lg:text-base">EventGo</span>
          </div>
          <div className="flex items-center justify-center lg:justify-end w-full lg:w-auto md:space-x-4 space-x-2 mt-3 mb-1 lg:mt-0 lg:mb-0">
            <span className="text-sm lg:text-base">&copy; 2023 mstomar698</span>
            <ul className="flex  lg:mt-0 ml-0 lg:ml-4">
              <li className="mr-4">
                <a href="#" className="hover:text-active text-sm lg:text-base">
                  Privacy Policy
                </a>
              </li>
              <li className="mr-4">
                <a href="" className="hover:text-active text-sm lg:text-base">
                  Terms of Service
                </a>
              </li>
              <li className="mt-1">
                <a className="text-active shadow-xl shadow-secondary text-[18px] lg:text-base">
                  <BsArrowUpSquare
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                    className=""
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
