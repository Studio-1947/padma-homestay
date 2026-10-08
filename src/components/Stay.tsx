import { lazy, Suspense, useRef } from "react";
import { useInView } from "motion/react";
import { Fire, WifiHigh } from "@phosphor-icons/react";
import { site, type Amenity } from "../content/site";
import { usePrefersReducedMotion } from "../lib/media";
import { CanvasBoundary } from "./CanvasBoundary";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

const PrayerFlags = lazy(() => import("../three/PrayerFlags"));

const amenity = (id: Amenity["id"]) => site.stay.items.find((item) => item.id === id)!;

function TileText({ id, className = "" }: { id: Amenity["id"]; className?: string }) {
  const item = amenity(id);
  return (
    <div className={className}>
      <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
      <p className="mt-2 max-w-[42ch] leading-relaxed opacity-80">{item.body}</p>
    </div>
  );
}

/** The 3D prayer flags only mount and render while this tile is on screen. */
function FlagsTile() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const mounted = useInView(ref, { once: true, margin: "200px" });
  const active = useInView(ref, { amount: 0.1 });

  return (
    <div ref={ref} className="hero-sky flex h-full min-h-[26rem] flex-col overflow-hidden rounded-[20px] border border-line">
      <div aria-hidden className="min-h-56 flex-1">
        {mounted && (
          <CanvasBoundary fallback={null}>
            <Suspense fallback={null}>
              <PrayerFlags active={active} reducedMotion={reducedMotion} />
            </Suspense>
          </CanvasBoundary>
        )}
      </div>
      <TileText id="terrace" className="p-6 md:p-7" />
    </div>
  );
}

export function Stay() {
  return (
    <section id="stay" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
      <Reveal className="md:text-center">
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
          {site.stay.headline}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted md:mx-auto md:max-w-[48ch]">{site.stay.body}</p>
      </Reveal>

      {/* Five amenities, five cells. Single column below md. */}
      <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-6">
        <Reveal className="md:col-span-4">
          <article className="relative isolate flex h-full min-h-[22rem] items-end overflow-hidden rounded-[20px]">
            <Photo
              name="meals"
              alt="Dinner laid out on the family table"
              width={1400}
              height={900}
              className="absolute inset-0 -z-20 size-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b1210]/85 via-[#0b1210]/25 to-transparent" />
            <TileText id="meals" className="p-6 text-[#f1f4f2] md:p-8" />
          </article>
        </Reveal>

        <Reveal className="md:col-span-2 md:row-span-2" delay={0.08}>
          <FlagsTile />
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.05}>
          <article className="flex h-full flex-col justify-between gap-10 rounded-[20px] bg-accent p-6 text-accent-ink md:p-7">
            <Fire size={32} />
            <TileText id="hotWater" />
          </article>
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.1}>
          <article className="flex h-full flex-col justify-between gap-10 rounded-[20px] border border-line bg-surface-2 p-6 md:p-7">
            <WifiHigh size={32} className="text-accent" />
            <TileText id="wifi" />
          </article>
        </Reveal>

        <Reveal className="md:col-span-6">
          <article className="grid overflow-hidden rounded-[20px] border border-line bg-surface-2 md:grid-cols-[1fr_1.6fr]">
            <TileText id="walks" className="self-center p-6 md:p-10" />
            <Photo
              name="walks"
              alt="A forest trail above the village"
              width={1600}
              height={700}
              className="aspect-[16/9] size-full object-cover md:aspect-[16/7]"
            />
          </article>
        </Reveal>
      </div>
    </section>
  );
}
