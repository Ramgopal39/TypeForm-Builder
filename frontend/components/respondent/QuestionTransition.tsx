'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionTransitionProps {
  children: React.ReactNode;
  activeId: number;
}

export const QuestionTransition: React.FC<QuestionTransitionProps> = ({
  children,
  activeId,
}) => {
  const variants = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: { y: -30, opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeId}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-xl px-6 py-12 flex flex-col gap-6"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
export default QuestionTransition;
