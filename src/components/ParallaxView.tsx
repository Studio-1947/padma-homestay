import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { site } from "../content/site";
import { useIsDesktop } from "../lib/media";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

/**
 * Three photographs at different depths. Nearer layers travel further on
 * scroll, which is what gives the collage its sense of distance.
 */
export function ParallaxView() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const enabled = desktop && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const farY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const farScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const midY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const nearY = useTransform(scrollYProgress, [0, 1], [260, -260]);

  return (
    <section id="view" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-40">
      <Reveal className="max-w-2xl md:ml-[12vw]">
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
          {site.view.headline}
        </h2>
        <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-muted">{site.view.body}</p>
      </Reveal>

      <div ref={ref} className="mt-14 grid gap-4 md:relative md:mt-24 md:block md:h-[105vh]">
        <motion.figure
          style={enabled ? { y: farY } : undefined}
          className="overflow-hidden rounded-[20px] md:absolute md:left-0 md:top-0 md:w-[60%]"
        >
          <motion.div style={enabled ? { scale: farScale } : undefined}>
            <Photo
              name="dhotrey"
              format="jpeg"
              alt="Snow peaks above the pine slopes and rooftops of Dhotrey"
              width={1828}
              height={860}
              className="aspect-[16/11] w-full object-cover"
            />
          </motion.div>
        </motion.figure>

        <motion.figure
          style={enabled ? { y: midY } : undefined}
          className="shadow-soft overflow-hidden rounded-[20px] md:absolute md:right-0 md:top-[20%] md:w-[33%]"
        >
          <Photo
            name="view-mid"
            alt="Cloud filling the valley below the house"
            width={900}
            height={1200}
            className="aspect-[4/3] w-full object-cover md:aspect-[3/4]"
          />
        </motion.figure>

        <motion.figure
          style={enabled ? { y: nearY } : undefined}
          className="shadow-soft overflow-hidden rounded-[20px] md:absolute md:bottom-0 md:left-[32%] md:w-[28%]"
        >
          <Photo
            name="view-near"
            alt="Prayer flags on the terrace railing"
            width={900}
            height={900}
            className="aspect-[4/3] w-full object-cover md:aspect-square"
          />
        </motion.figure>
      </div>
    </section>
  );
}
