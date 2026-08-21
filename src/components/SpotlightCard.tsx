import type { ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";

export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue("50%");
  const y = useMotionValue("50%");
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${x} ${y}, rgba(255,255,255,.11), transparent 42%)`;

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl border border-hairline bg-card/50 ${className}`}
      whileHover={reduceMotion ? undefined : { y: -5, transition: { duration: 0.25 } }}
      onPointerMove={(event) => {
        if (reduceMotion) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        x.set(`${event.clientX - bounds.left}px`);
        y.set(`${event.clientY - bounds.top}px`);
      }}
      onPointerLeave={() => {
        x.set("50%");
        y.set("50%");
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
