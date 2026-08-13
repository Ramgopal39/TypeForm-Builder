'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  animate = true,
  delay = 0,
  onClick,
}) => {
  const baseStyle = `rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-6 ${
    onClick ? 'cursor-pointer hover:border-slate-800 transition-colors' : ''
  } ${className}`;

  if (!animate) {
    return (
      <div className={baseStyle} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={onClick ? { y: -2 } : undefined}
      className={baseStyle}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
export default Card;
