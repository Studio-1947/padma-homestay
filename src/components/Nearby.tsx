import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HouseLineIcon } from "@phosphor-icons/react";
import { site, type Place } from "../content/site";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

const places = site.nearby.items;
// Dhotrey sits after the first stop (Maneybhanjang, below us) and before the climb to Tonglu.
const HOME_AFTER = 0;

/** The homestay's own mark on the trail; not selectable. */
function HomeStop({ compact = false }: { compact?: boolean }) {
  return compact ? (
    <li className="flex shrink-0 items-center gap-2 rounded-full border border-accent/40 px-4 py-2.5 text-sm font-medium text-accent">
      <HouseLineIcon size={16} weight="fill" />
      Dhotrey
    </li>
  ) : (
    <li className="relative flex items-center gap-4 py-3 pl-0">
      <span className="relative z-10 grid size-9 place-items-center rounded-full bg-accent text-accent-ink ring-8 ring-surface">
        <HouseLineIcon size={18} weight="fill" />
      </span>
      <div>
        <p className="font-display text-lg font-semibold tracking-tight">
          Dhotrey
        </p>
        <p className="text-sm text-muted">Padma Homestay, where you start</p>
      </div>
    </li>
  );
}

/**
 * The places around us as stops on one trail. Picking a stop shows its photo; on large screens the
 * trail runs down the left, on smaller ones it becomes a row of stops above the photo.
 */
export function Nearby() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(1); // Tonglu, the first walk from the door
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const place = places[active];

  // Arrow keys move along the trail, as in any tab list.
  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[
      event.key
    ];
    if (!step) return;
    event.preventDefault();
    const next = (active + step + places.length) % places.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const stop = (p: Place, i: number, compact: boolean) => {
    const selected = i === active;
    return (
      <li
        key={p.id}
        role="presentation"
        className={compact ? "shrink-0" : "relative"}
      >
        <button
          ref={(el) => {
            if (!compact) tabs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={compact ? undefined : `stop-${p.id}`}
          aria-selected={selected}
          aria-controls="nearby-panel"
          tabIndex={compact || selected ? 0 : -1}
          onClick={(event) => {
            setActive(i);
            // Keep the picked stop in view in the swipeable row.
            if (compact)
              event.currentTarget.scrollIntoView({
                behavior: reduce ? "auto" : "smooth",
                block: "nearest",
                inline: "center",
              });
          }}
          className={
            compact
              ? `rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  selected
                    ? "bg-ink text-surface"
                    : "bg-surface-2 text-muted hover:text-ink"
                }`
              : "group flex w-full items-center gap-4 rounded-[14px] py-3 text-left outline-offset-4"
          }
        >
          {compact ? (
            p.name
          ) : (
            <>
              <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full bg-surface ring-8 ring-surface">
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    selected
                      ? "size-4 bg-ink"
                      : "size-2.5 bg-line group-hover:bg-muted"
                  }`}
                />
              </span>
              <span className="min-w-0">
                <span
                  className={`block font-display text-lg font-semibold tracking-tight transition-colors ${
                    selected ? "text-ink" : "text-muted group-hover:text-ink"
                  }`}
                >
                  {p.name}
                </span>
                <span className="block text-sm text-muted">{p.distance}</span>
              </span>
            </>
          )}
        </button>
      </li>
    );
  };

  return (
    <section
      id="nearby"
      className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28"
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionIntro
            headline={site.nearby.headline}
            body={site.nearby.body}
          />

          {/* The trail, large screens: a vertical line through every stop. */}
          <Reveal delay={0.08} className="mt-10 hidden lg:block">
            <ol
              role="tablist"
              aria-label="Places along the trail"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="relative before:absolute before:bottom-7 before:left-[17px] before:top-7 before:w-0.5 before:rounded-full before:bg-line"
            >
              {places.map((p, i) => (
                <FragmentWithHome key={p.id} home={i === HOME_AFTER}>
                  {stop(p, i, false)}
                </FragmentWithHome>
              ))}
            </ol>
          </Reveal>

          {/* The trail, smaller screens: a swipeable row of stops. */}
          <ol
            role="tablist"
            aria-label="Places along the trail"
            className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:-mx-8 md:px-8 lg:hidden [&::-webkit-scrollbar]:hidden"
          >
            {places.map((p, i) => (
              <FragmentWithHome key={p.id} home={i === HOME_AFTER} compact>
                {stop(p, i, true)}
              </FragmentWithHome>
            ))}
          </ol>
        </div>

        <Reveal delay={0.12}>
          <div
            id="nearby-panel"
            role="tabpanel"
            aria-labelledby={`stop-${place.id}`}
            className="lg:sticky lg:top-28"
          >
            <div className="relative isolate aspect-[4/5] overflow-hidden rounded-[24px] bg-surface-2 sm:aspect-[5/4] lg:aspect-[9/10]">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={place.id}
                  className="absolute inset-0 -z-20"
                  initial={
                    reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Photo
                    name={place.image}
                    format="webp"
                    alt={place.name}
                    width={900}
                    height={1100}
                    className="size-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b1210]/85 via-[#0b1210]/25 to-transparent"
              />

              <div className="flex h-full flex-col justify-end p-6 text-[#f1f4f2] md:p-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={place.id}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="inline-flex rounded-full bg-[#f1f4f2]/15 px-3 py-1 text-sm backdrop-blur-md">
                      {place.distance}
                    </p>
                    <h3 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                      {place.name}
                    </h3>
                    <p className="mt-2 max-w-[44ch] leading-relaxed text-[#f1f4f2]/85">
                      {place.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted">
              <a
                href={place.credit.source}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-3 inline-flex min-h-11 items-center underline decoration-line underline-offset-2 transition-colors hover:text-ink"
              >
                Photo: {place.credit.author}, {place.credit.license}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** A trail stop, followed by the homestay's own stop when it sits right after this one. */
function FragmentWithHome({
  home,
  compact = false,
  children,
}: {
  home: boolean;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      {children}
      {home && <HomeStop compact={compact} />}
    </>
  );
}
