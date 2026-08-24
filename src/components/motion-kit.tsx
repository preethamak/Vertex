import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Thin scroll-progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  if (reduceMotion) return null;
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-accent via-[oklch(0.7_0.14_60)] to-[oklch(0.82_0.06_50)]"
    />
  );
}

/** Masked, word-by-word entrance for display headings. */
export function KineticHeading({
  text,
  className = "",
  delay = 0,
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  if (reduceMotion) return <span className={className}>{text}</span>;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            aria-hidden="true"
            className="inline-block will-change-transform"
            initial={{ y: "115%", rotate: 2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{
              duration: 0.85,
              delay: delay + index * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Counts up to a target number the first time it scrolls into view. */
export function CountUp({
  to,
  suffix = "",
  duration = 1.6,
  className = "",
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setValue(to);
      return;
    }
    let frame: number;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

/** Subtly pulls its children toward the cursor. */
export function Magnetic({
  children,
  strength = 14,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        x.set((dx / rect.width) * strength * 2);
        y.set((dy / rect.height) * strength * 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Endless horizontal ticker. Duplicate the children for a seamless loop. */
export function Ticker({ items, className = "" }: { items: string[]; className?: string }) {
  const reduceMotion = useReducedMotion();
  const row = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden border-y border-hairline py-3 ${className}`}
    >
      <div
        className={`flex w-max gap-10 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground ${
          reduceMotion ? "" : "marquee-track"
        }`}
      >
        {row.map((item, index) => (
          <span key={index} className="flex items-center gap-10 whitespace-nowrap">
            {item}
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Scroll-linked parallax wrapper. */
export function Parallax({
  children,
  distance = 60,
  className = "",
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  if (reduceMotion)
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
