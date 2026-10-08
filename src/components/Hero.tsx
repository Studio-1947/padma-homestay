import { lazy, Suspense, useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { site } from "../content/site";
import { useTheme } from "../lib/theme";
import { CanvasBoundary } from "./CanvasBoundary";
import { Photo } from "./Photo";

const HeroScene = lazy(() => import("../three/HeroScene"));

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [theme] = useTheme();
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { amount: 0.05 });

  // Text leaves faster than the scene, so the mountains read as further away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const fallback = (
    <Photo
      name="hero"
      alt="Snow peaks seen from the homestay at dawn"
      width={1920}
      height={1200}
      eager
      className="size-full object-cover"
    />
  );

  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100dvh] items-center overflow-hidden">
      <motion.div aria-hidden className="hero-sky absolute inset-0 -z-10" style={reduce ? undefined : { y: sceneY }}>
        <CanvasBoundary fallback={fallback}>
          <Suspense fallback={null}>
            <HeroScene theme={theme} active={inView} reducedMotion={reduce} />
          </Suspense>
        </CanvasBoundary>
      </motion.div>

      {/* Scrim keeps the copy readable over the ridges in both themes. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-surface/80 via-surface/30 to-transparent md:bg-gradient-to-r md:from-surface/85 md:via-surface/35"
      />

      <motion.div
        className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-24 md:px-8"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <div className="max-w-2xl">
          <motion.p {...(reduce ? {} : enter(0.1))} className="text-sm font-medium text-accent">
            {site.hero.eyebrow}
          </motion.p>
          <motion.h1
            {...(reduce ? {} : enter(0.2))}
            className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-6xl lg:text-7xl"
          >
            {site.hero.headline}
          </motion.h1>
          <motion.p {...(reduce ? {} : enter(0.32))} className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink/80">
            {site.hero.subtext}
          </motion.p>
          <motion.div {...(reduce ? {} : enter(0.44))} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#booking"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 font-medium text-accent-ink transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Check availability
              <ArrowRight size={18} weight="bold" />
            </a>
            <a
              href="#rooms"
              className="inline-flex h-12 items-center rounded-full border border-ink/25 bg-surface/60 px-7 font-medium backdrop-blur-sm transition-colors hover:bg-surface active:scale-[0.98]"
            >
              See the rooms
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
