import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const VARIANTS = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  outline: 'border border-white text-white hover:bg-white hover:text-black',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-3 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        'rounded-full font-semibold transition-all duration-200 shadow-lg flex gap-2',
        VARIANTS[variant],
        SIZES[size]
      )}
    >
      {children}
    </motion.button>
  );
}
