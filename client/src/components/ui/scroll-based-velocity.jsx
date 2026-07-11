"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Helper to wrap value between min and max
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export const ScrollVelocityRow = ({
  children,
  baseVelocity = 10,
  direction = 1,
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Shift percentage mapping for seamless looping
  const x = useTransform(baseX, (v) => `${wrap(-10, -35, v)}%`);
  const directionFactor = useRef(direction);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Accelerate depending on scroll speed
    if (velocityFactor.get() !== 0) {
      const currentScrollVel = smoothVelocity.get();
      if (currentScrollVel < 0) {
        directionFactor.current = -1;
      } else if (currentScrollVel > 0) {
        directionFactor.current = 1;
      }
      moveBy += directionFactor.current * moveBy * velocityFactor.get();
    }

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex flex-nowrap overflow-hidden whitespace-nowrap">
      <motion.div className="flex flex-nowrap whitespace-nowrap text-stone-950 font-black uppercase tracking-tight" style={{ x }}>
        {/* Repeating text to fill marquee width */}
        <span className="mr-12">{children}</span>
        <span className="mr-12">{children}</span>
        <span className="mr-12">{children}</span>
        <span className="mr-12">{children}</span>
        <span className="mr-12">{children}</span>
        <span className="mr-12">{children}</span>
      </motion.div>
    </div>
  );
};

export const ScrollVelocityContainer = ({ children, className }) => {
  return (
    <div className={cn("relative w-full flex flex-col gap-2 overflow-hidden", className)}>
      {children}
    </div>
  );
};
