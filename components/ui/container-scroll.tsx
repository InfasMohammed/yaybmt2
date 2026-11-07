"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Scroll-linked 3D card (after the MIT "Container Scroll Animation" pattern by Aceternity UI):
 * the card starts tilted back and settles flat as it scrolls into view. Flat when reduced motion.
 */
export default function ContainerScroll({
  header,
  children,
  className = "",
}: {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "center center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });
  const rotateX = useTransform(progress, [0, 1], [24, 0]);
  const scale = useTransform(progress, [0, 1], [0.9, 1]);
  const lift = useTransform(progress, [0, 1], [60, 0]);
  const glow = useTransform(progress, [0, 1], [0, 1]);
  return (
    <div ref={container} className={"container-scroll " + className}>
      {header && (
        <motion.div
          className="container-scroll-header"
          style={reduce ? undefined : { y: lift }}
        >
          {header}
        </motion.div>
      )}
      <div className="container-scroll-stage">
        <motion.div
          className="container-scroll-glow"
          aria-hidden="true"
          style={reduce ? { opacity: 1 } : { opacity: glow }}
        />
        <motion.div
          className="container-scroll-card"
          style={reduce ? undefined : { rotateX, scale }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
