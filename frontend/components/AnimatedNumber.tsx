'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  suffix?: string;
}

export function AnimatedNumber({ value, className = "", suffix = "" }: AnimatedNumberProps) {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { 
    damping: 100, 
    stiffness: 100 
  });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest).toLocaleString());
    });
    return unsubscribe;
  }, [springValue]);
  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}{suffix}
    </motion.span>
  );
}