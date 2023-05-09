import React from 'react';
import { motion } from 'framer-motion';
import { styles } from '@/app/styles';

const PageCard = ({ name, description, image, pageRoute }: any) => {
  const backgroundImage = `url(${image})`;
  return (
    <motion.div
      onClick={() => (window.location.href = `${pageRoute}`)}
      className={``}
    >
      <div
        className="pagecard justify-center items-center flex rounded-2xl hover:shadow-2xl hover:shadow-active p-0.5"
        style={{ backgroundImage }}
      >
        <div className={`${styles.padding}`}>
          <h3 className="text-active font-bold md:text-[24px] sm:text-[18px] max-sm:text-[18px] text-center">
            {name}
          </h3>
          <p className="mt-4 text-primary md:text-[14px] sm:text-[12px] max-sm:text-[12px] text-center">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PageCard;
