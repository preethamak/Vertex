import { motion, useReducedMotion } from "motion/react";

/** Decorative layer shared by every public page. It deliberately never captures input. */
export function Atmosphere({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="noise-overlay absolute inset-0" />
      <div className="grid-backdrop absolute inset-0 opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <motion.div
        className="absolute -left-40 -top-56 h-[38rem] w-[38rem] rounded-full bg-white/[0.055] blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 70, 0], y: [0, 40, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-48 top-40 h-[30rem] w-[30rem] rounded-full bg-slate-300/[0.055] blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -75, 0], y: [0, -35, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="vignette absolute inset-0" />
    </div>
  );
}
