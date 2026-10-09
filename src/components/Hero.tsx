import { lazy, Suspense, useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { site } from "../content/site";
import { useTheme } from "../lib/theme";
import { CanvasBoundary } from "./CanvasBoundary";
import { Photo } from "./Photo";

/**
 * Which 3D scene the hero shows:
 * "photo" = the Dhotrey photo with depth parallax, "model" = the snowy mountain model.
 */
const HERO_SCENE: "photo" | "model" = "photo";

const HeroScene = lazy(() =>
  HERO_SCENE === "photo" ? import("../three/PhotoDepthScene") : import("../three/HeroScene"),
);

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
      name="dhotrey"
      format="png"
      alt="Snow peaks above the pine slopes and rooftops of Dhotrey"
      width={1828}
      height={860}
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

      {/* Fades the foot of the scene into the page. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-surface to-transparent" />

      <motion.div
        className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-24 md:px-8"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        {/* Light text with a soft shadow sits directly on the photo, so no wash is needed over it. */}
        <div className="max-w-2xl text-[#f6f8f7] [text-shadow:0_1px_18px_rgb(8_16_28/0.55)]">
          <motion.p {...(reduce ? {} : enter(0.1))} className="text-sm font-medium">
            {site.hero.eyebrow}
          </motion.p>
          <motion.h1
            {...(reduce ? {} : enter(0.2))}
            className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-6xl lg:text-7xl"
          >
            {site.hero.headline}
          </motion.h1>
          <motion.p {...(reduce ? {} : enter(0.32))} className="mt-6 max-w-[52ch] text-lg leading-relaxed">
            {site.hero.subtext}
          </motion.p>
          <motion.div {...(reduce ? {} : enter(0.44))} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#booking"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 font-medium text-accent-ink [text-shadow:none] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Check availability
              <ArrowRight size={18} weight="bold" />
            </a>
            <a
              href="#rooms"
              className="inline-flex h-12 items-center rounded-full border border-white/60 bg-[#08101c]/30 px-7 font-medium backdrop-blur-sm transition-colors hover:bg-[#08101c]/50 active:scale-[0.98]"
            >
              See the rooms
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
