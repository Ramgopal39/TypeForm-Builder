'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ThankYouScreenProps {
  formTitle: string;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ formTitle }) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-white select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="flex flex-col items-center max-w-md text-center"
      >
        {/* Animated Check badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
          className="h-16 w-16 bg-slate-900 text-white rounded-full flex items-center justify-center mb-6 shadow-md"
        >
          <Check className="h-8 w-8" />
        </motion.div>

        <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">
          All done! Thank you.
        </h1>
        
        <p className="text-sm text-slate-400 font-medium mt-3 leading-relaxed">
          Your answers for <span className="font-semibold text-slate-650">"{formTitle}"</span> have been submitted successfully.
        </p>

        <span className="text-[10px] text-slate-350 font-bold mt-12 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
          Powered by Scaler Forms
        </span>
      </motion.div>
    </div>
  );
};
export default ThankYouScreen;
