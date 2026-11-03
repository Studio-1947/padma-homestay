import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "../content/site";
import { SectionIntro } from "./SectionIntro";

const reviews = site.reviews.items;

/** One quote at a time, large. The guests' names double as the switcher. */
export function Reviews() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const review = reviews[active];

  return (
    <section id="reviews" className="bg-surface-2">
      <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <SectionIntro headline={site.reviews.headline} />

        {/* Names in a column to the left of the quote from md; a row of names above it on phones. */}
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[15rem_1fr] md:gap-16">
          {/* Reserves room for the longest quote so the section does not jump when switching. */}
          <div className="order-2 grid min-h-[13rem] md:min-h-[14rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={active}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="max-w-[34ch] font-display text-2xl font-medium leading-[1.25] tracking-tight md:text-4xl">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-muted">
                  <span className="font-medium text-ink">{review.name}</span>, {review.from}. {review.stayed}.
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div
            role="tablist"
            aria-label="Guest reviews"
            className="order-1 flex flex-wrap gap-2 md:flex-col md:gap-1 md:border-l md:border-line md:pl-4"
          >
            {reviews.map((item, i) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`rounded-full px-4 py-2.5 text-left text-sm font-medium transition-colors md:rounded-[12px] ${
                  i === active ? "bg-ink text-surface" : "text-muted hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
