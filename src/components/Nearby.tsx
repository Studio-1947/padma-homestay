import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { site } from "../content/site";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

const arrowButton =
  "grid size-11 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-ink/5 active:scale-[0.96]";

/** A swipeable row of places nearby. The row runs edge to edge while its first card lines up with the page. */
export function Nearby() {
  const track = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  const scroll = (direction: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="nearby" className="py-20 md:py-28">
      <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-4 md:px-8">
        <SectionIntro headline={site.nearby.headline} body={site.nearby.body} />
        <div className="hidden shrink-0 gap-2 md:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous places" className={arrowButton}>
            <ArrowLeftIcon size={18} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="More places" className={arrowButton}>
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </div>

      {/* The row fades in as one piece: cards still off to the side must already be visible when swiped in. */}
      <Reveal>
        <ul
          ref={track}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] md:mt-14 md:scroll-px-[max(2rem,calc((100vw_-_1400px)/2_+_2rem))] md:px-[max(2rem,calc((100vw_-_1400px)/2_+_2rem))] [&::-webkit-scrollbar]:hidden"
        >
          {site.nearby.items.map((place) => (
            <li key={place.id} className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[27%]">
              <article>
                <div className="overflow-hidden rounded-[20px] bg-surface-2">
                  <Photo
                    name={place.image}
                    format="webp"
                    alt={place.name}
                    width={900}
                    height={1100}
                    className="aspect-[9/11] w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{place.name}</h3>
                  <p className="shrink-0 text-sm text-muted">{place.distance}</p>
                </div>
                <p className="mt-1.5 leading-relaxed text-muted">{place.body}</p>
                <p className="mt-3 text-xs text-muted/80">
                  <a
                    href={place.credit.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-line underline-offset-2 transition-colors hover:text-ink"
                  >
                    Photo: {place.credit.author}, {place.credit.license}
                  </a>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
