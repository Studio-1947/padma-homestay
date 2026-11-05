import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowDownIcon } from "@phosphor-icons/react";
import { site } from "../content/site";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

const phases = site.view.phases;

/*
  Where each photo takes over, as a share of the scroll through the pinned stretch.
  Each one holds for a while, then the next fades in over it.
*/
const FADES: [number, number][] = [
  [0, 0], // morning is there from the start
  [0.28, 0.44],
  [0.62, 0.78],
];

/** How present a phase's caption is: fully shown while its photo is on top, gone while the next arrives. */
function usePhaseVisibility(index: number, progress: MotionValue<number>) {
  const next = FADES[index + 1];
  const [from, to] = FADES[index];
  const input = index === 0 ? [0, next[0], next[1] - 0.06] : next ? [from, to, next[0], next[1] - 0.06] : [from, to];
  const output = index === 0 ? [1, 1, 0] : next ? [0, 1, 1, 0] : [0, 1];
  return useTransform(progress, input, output);
}

function Phase({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const [from, to] = FADES[index];
  const opacity = useTransform(progress, index === 0 ? [0, 1] : [from, to], index === 0 ? [1, 1] : [0, 1]);
  const phase = phases[index];

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <Photo
        name={phase.image}
        format="webp"
        alt={phase.alt}
        width={2990}
        height={2104}
        eager={index === 0}
        // Portrait screens show about a third of the width: keep the snow range (left of the jeep) in frame.
        className="size-full object-cover object-[20%_70%] landscape:object-[center_70%]"
      />
    </motion.div>
  );
}

/** The big time-of-day name and its one line, stacked in the same cell so they crossfade. */
function Caption({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const opacity = usePhaseVisibility(index, progress);
  const y = useTransform(opacity, [0, 1], [14, 0]);
  const phase = phases[index];

  return (
    <motion.div style={{ opacity, y }} className="col-start-1 row-start-1">
      <p className="font-display text-4xl font-semibold leading-none tracking-tighter sm:text-5xl md:text-7xl">{phase.label}</p>
      <p className="mt-2 max-w-[34ch] text-[0.9375rem] leading-relaxed text-[#f6f8f7]/85 sm:mt-3 sm:text-base md:text-lg">{phase.note}</p>
    </motion.div>
  );
}

/** One stop on the day track. It brightens while its phase is the one showing. */
function Stop({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const visible = usePhaseVisibility(index, progress);
  const opacity = useTransform(visible, [0, 1], [0.5, 1]);
  const align = index === 0 ? "justify-self-start" : index === phases.length - 1 ? "justify-self-end" : "justify-self-center";

  return (
    <motion.span style={{ opacity }} className={`text-sm font-medium tabular-nums ${align}`}>
      {phases[index].time}
    </motion.span>
  );
}

/** Phones only: a nudge to keep scrolling, gone once night arrives. */
function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, [0.7, 0.85], [1, 0]);

  return (
    <motion.div style={{ opacity }} className="flex items-center gap-3 md:hidden">
      <span className="relative grid h-11 w-7 place-items-start justify-center overflow-hidden rounded-full border border-[#f6f8f7]/50 pt-2">
        <motion.span
          className="block"
          animate={reduce ? undefined : { y: [0, 14, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        >
          <ArrowDownIcon size={12} weight="bold" />
        </motion.span>
      </span>
      <span className="text-sm font-medium text-[#f6f8f7]/85">Keep scrolling to watch the day pass</span>
    </motion.div>
  );
}

/**
 * One view of the ridge through a day. The photo pins to the screen and, as the reader keeps
 * scrolling, morning fades into evening and evening into night, like a slow time lapse.
 * The frame itself never moves or zooms, so the scene stays put while only the light changes.
 */
export function ParallaxView() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  // The marker on the day track travels between stops in step with the crossfades.
  const marker = useTransform(scrollYProgress, [0.28, 0.44, 0.62, 0.78], ["0%", "50%", "50%", "100%"]);
  const fill = useTransform(scrollYProgress, [0.28, 0.44, 0.62, 0.78], [0, 0.5, 0.5, 1]);

  return (
    <section id="view" aria-labelledby="view-title">
      {/*
        The tall track gives the scroll room; the frame inside it stays pinned while the day passes.
        On phones the address bar hides on scroll and the screen grows, so the photo fills the tallest
        height (lvh) while the text keeps to the shortest (svh): no gap at the bottom, nothing hidden under the bar.
      */}
      <div ref={track} className="relative h-[300lvh]">
        <div className="sticky top-0 h-[100lvh] overflow-hidden text-[#f6f8f7]">
          {phases.map((phase, i) => (
            <Phase key={phase.image} index={i} progress={scrollYProgress} />
          ))}

          {/* Shade at the top and bottom only, so the text reads while the middle of the photo stays clear. */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-[42svh] bg-gradient-to-b from-[#08101c]/55 via-[#08101c]/20 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[calc(48svh+100lvh-100svh)] bg-gradient-to-t from-[#08101c]/70 via-[#08101c]/25 to-transparent" />

          <div className="relative mx-auto flex h-[100svh] max-w-[1400px] flex-col justify-between px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-24 sm:pt-28 md:px-8 md:pb-12 md:pt-32">
            <Reveal className="max-w-xl [text-shadow:0_1px_24px_rgb(8_16_28/0.35)]">
              <h2 id="view-title" className="text-balance font-display text-[2rem] font-semibold leading-[1.05] tracking-tighter sm:text-4xl md:text-5xl">
                {site.view.headline}
              </h2>
              <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-[#f6f8f7]/85 sm:mt-4 sm:text-lg">{site.view.body}</p>
            </Reveal>

            {/* Phones: caption over a scroll cue. From md: caption beside the day track. */}
            <div aria-hidden className="grid gap-5 sm:gap-8 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end md:gap-16">
              <div className="grid [text-shadow:0_1px_24px_rgb(8_16_28/0.4)]">
                {phases.map((phase, i) => (
                  <Caption key={phase.image} index={i} progress={scrollYProgress} />
                ))}
              </div>

              <ScrollCue progress={scrollYProgress} />

              {/* The day track, from md. */}
              <div className="hidden md:block md:pb-2">
                <div className="relative h-px bg-[#f6f8f7]/30">
                  <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-[#f6f8f7]" />
                  <motion.div style={{ x: marker }} className="absolute inset-x-0 top-0">
                    <span className="absolute -top-[5px] -ml-[5px] size-[11px] rounded-full bg-[#f6f8f7] shadow-[0_0_0_4px_rgb(246_248_247/0.18)]" />
                  </motion.div>
                </div>
                <div className="mt-3 grid grid-cols-3 sm:mt-4">
                  {phases.map((phase, i) => (
                    <Stop key={phase.image} index={i} progress={scrollYProgress} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
