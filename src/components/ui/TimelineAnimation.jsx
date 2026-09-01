import { motion, useInView } from 'motion/react';
import React from 'react';

export const TimelineAnimation = ({
  children,
  animationNum = 1,
  timelineRef,
  className = '',
  as = 'div',
  customVariants,
  once = true,
  ...props
}) => {
  const defaultSequenceVariants = {
    visible: (i) => ({
      filter: 'blur(0px)',
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      },
    }),
    hidden: {
      filter: 'blur(16px)',
      y: 24,
      opacity: 0,
    },
  };

  const sequenceVariants = customVariants || defaultSequenceVariants;
  const isInView = useInView(timelineRef, { once });
  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={animationNum}
      variants={sequenceVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
