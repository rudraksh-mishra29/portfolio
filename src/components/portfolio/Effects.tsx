import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";

export function MotionSystem() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
    const lighting = gsap.context(() => {
      gsap.to(".hero, #projects", {
        "--ambient-opacity": 0.55,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    const update = (time: number) => lenis.raf(time * 1000);
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLElement>(".orbit-button");
      if (!button) return;
      const rect = button.getBoundingClientRect();
      gsap.to(button, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.12,
        y: (event.clientY - rect.top - rect.height / 2) * 0.15,
        duration: 0.4,
        ease: "power3.out",
      });
    };
    const leave = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLElement>(".orbit-button");
      if (button) gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerout", leave);
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      lenis.destroy();
      lighting.revert();
    };
  }, [reduced]);
  return <Cursor />;
}
function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100),
    y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 32 }),
    sy = useSpring(y, { stiffness: 400, damping: 32 });
  const tx = useSpring(x, { stiffness: 160, damping: 30 }),
    ty = useSpring(y, { stiffness: 160, damping: 30 });
  const ux = useSpring(x, { stiffness: 80, damping: 26 }),
    uy = useSpring(y, { stiffness: 80, damping: 26 });
  useEffect(() => {
    if (reduced || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const move = (e: PointerEvent) => {
      setEnabled(true);
      x.set(e.clientX);
      y.set(e.clientY);
      setHover(!!(e.target instanceof Element && e.target.closest("a,button,.project-card")));
    };
    const leave = () => setEnabled(false);
    document.body.classList.add("custom-cursor");
    window.addEventListener("pointermove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      document.body.classList.remove("custom-cursor");
    };
  }, [x, y, reduced]);
  if (!enabled || reduced) return null;
  return (
    <>
      <motion.div
        className="ai-cursor"
        style={{ x: sx, y: sy }}
        animate={{ scale: hover ? 2.3 : 1 }}
      />
      <motion.div className="cursor-trail" style={{ x: tx, y: ty }} />
      <motion.div className="cursor-trail" style={{ x: ux, y: uy }} />
    </>
  );
}
export function BootSequence() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (reduced) {
      setVisible(false);
      return;
    }
    const value = { progress: 0 };
    const tween = gsap.to(value, {
      progress: 100,
      duration: 1.45,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(value.progress)),
      onComplete: () => setVisible(false),
    });
    return () => {
      tween.kill();
    };
  }, [reduced]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="boot-screen"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.55 }}
          aria-hidden="true"
        >
          <div className="boot-content">
            <motion.div
              className="boot-mark"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              R
            </motion.div>
            <div className="flex justify-between mono text-primary">
              <span>Rudraksh OS / Initializing</span>
              <span>{progress}%</span>
            </div>
            <div className="boot-line">
              <motion.div animate={{ width: `${progress}%` }} />
            </div>
            <div className="boot-diagnostics mono">
              {progress > 15 && <div>✓ Neural core connected</div>}
              {progress > 45 && <div>✓ Orbital systems calibrated</div>}
              {progress > 75 && <div>✓ All systems ready · Welcome aboard</div>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rx = useSpring(x, { stiffness: 160, damping: 22 }),
    ry = useSpring(y, { stiffness: 160, damping: 22 });
  return (
    <motion.article
      className={className}
      style={{ rotateX: rx, rotateY: ry }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((-(e.clientY - r.top - r.height / 2) / r.height) * 5);
        y.set(((e.clientX - r.left - r.width / 2) / r.width) * 5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={reduced ? {} : { y: -5, borderColor: "var(--primary)", boxShadow: "var(--glow)" }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      {children}
    </motion.article>
  );
}
