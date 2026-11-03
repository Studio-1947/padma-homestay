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
    <section id="view" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <Reveal className="max-w-2xl md:ml-[12vw]">
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter md:text-5xl">
          {site.view.headline}
        </h2>
        <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-muted">{site.view.body}</p>
      </Reveal>

      <div ref={ref} className="mt-14 grid gap-4 md:relative md:mt-16 md:block md:h-[88vh]">
        <motion.figure
          style={enabled ? { y: farY } : undefined}
          className="overflow-hidden rounded-[20px] md:absolute md:left-0 md:top-0 md:w-[60%]"
        >
          <motion.div style={enabled ? { scale: farScale } : undefined}>
            <Photo
              name="sunset"
              format="webp"
              alt="The snow range lit gold at sunset above dark ridges"
              width={680}
              height={383}
              className="aspect-[16/11] w-full object-cover"
            />
          </motion.div>
        </motion.figure>

        <motion.figure
          style={enabled ? { y: midY } : undefined}
          className="shadow-soft overflow-hidden rounded-[20px] md:absolute md:right-0 md:top-[20%] md:w-[33%]"
        >
          <Photo
            name="sunset"
            format="webp"
            alt="The highest summit catching the last light"
            width={680}
            height={383}
            className="aspect-[4/3] w-full object-cover object-[58%_center] md:aspect-[3/4]"
          />
        </motion.figure>

        <motion.figure
          style={enabled ? { y: nearY } : undefined}
          className="shadow-soft overflow-hidden rounded-[20px] md:absolute md:bottom-0 md:left-[32%] md:w-[28%]"
        >
          <Photo
            name="sunset"
            format="webp"
            alt="Pine tops in silhouette against the range at dusk"
            width={680}
            height={383}
            className="aspect-[4/3] w-full object-cover object-right md:aspect-square"
          />
        </motion.figure>
      </div>
    </section>
  );
}
